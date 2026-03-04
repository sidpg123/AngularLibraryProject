import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatsService } from '../stats.service';
import { LoadingSpinnerComponent } from '../../shared/loading.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('issuesChart')  issuesChartRef!: ElementRef;
  @ViewChild('booksChart')   booksChartRef!: ElementRef;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef;

  dashboardData: any;
  booksStats: any;
  issuesStats: any;

  isLoading = false;
  errorMessage = '';
  today = new Date();

  constructor(
    private statsService: StatsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {}

  loadData(): void {
    this.isLoading = true;
    this.statsService.getDashboardStats().subscribe({
      next: (res) => {
        this.dashboardData = res;
        this.loadAdditionalCharts();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load dashboard stats.';
        this.isLoading = false;
      }
    });
  }

  loadAdditionalCharts(): void {
    // Use forkJoin-style manual tracking so both calls finish before rendering
    let booksLoaded = false;
    let issuesLoaded = false;

    const tryRender = () => {
      if (!booksLoaded || !issuesLoaded) return;

      // Both done — flip flag, detect changes, then render
      this.isLoading = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.renderIssuesChart();
        this.renderBooksChart();
        this.renderMonthlyChart();
      }, 0);
    };

    this.statsService.getBooksStats().subscribe({
      next: (res) => {
        this.booksStats = res;
        booksLoaded = true;
        tryRender();
      },
      error: () => {
        booksLoaded = true; // don't block the other chart
        tryRender();
      }
    });

    this.statsService.getIssuesStats().subscribe({
      next: (res) => {
        this.issuesStats = res;
        issuesLoaded = true;
        tryRender();
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Failed to load chart data.';
        issuesLoaded = true;
        this.isLoading = false;
      }
    });
  }

  // ── Shared chart defaults ─────────────────────────────────
  private baseFont = {
    family: "'Plus Jakarta Sans', sans-serif",
    size: 12,
    weight: '500'
  };

  private gridColor = 'rgba(180, 176, 168, 0.18)';
  private tickColor = '#a8a49c';

  // ── Pie — Issue status ────────────────────────────────────
  renderIssuesChart(): void {
    if (!this.issuesChartRef?.nativeElement || !this.issuesStats) return;
    new Chart(this.issuesChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: Object.keys(this.issuesStats.byStatus),
        datasets: [{
          data: Object.values(this.issuesStats.byStatus),
          backgroundColor: ['#6366f1', '#f59e0b', '#ef4444'],
          borderColor:     ['#ffffff', '#ffffff', '#ffffff'],
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: this.baseFont as any,
              color: this.tickColor,
              padding: 16,
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#1f1d1a',
            titleColor: '#f0edf8',
            bodyColor: '#a8a49c',
            padding: 12,
            cornerRadius: 8,
            titleFont: this.baseFont as any,
            bodyFont: { ...this.baseFont, size: 11 } as any
          }
        }
      }
    });
  }

  // ── Bar — Books by category ───────────────────────────────
  renderBooksChart(): void {
    if (!this.booksChartRef?.nativeElement || !this.booksStats) return;

    // Support both shapes the API might return:
    //   { byCategory: { Fiction: 12, Science: 5 } }         → flat number
    //   { byCategory: { Fiction: { count: 12 }, ... } }     → object with count
    // Also support a top-level array of Book[] grouped by category
    let categoryMap: Record<string, number> = {};

    if (this.booksStats.byCategory) {
      const raw = this.booksStats.byCategory;
      for (const key of Object.keys(raw)) {
        const val = raw[key];
        categoryMap[key] = typeof val === 'object' && val !== null
          ? (val.count ?? val.total ?? 0)
          : Number(val);
      }
    } else if (Array.isArray(this.booksStats)) {
      // Raw Book[] array — group by category ourselves
      for (const book of this.booksStats as any[]) {
        const cat = book.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      }
    }

    const categories = Object.keys(categoryMap);
    const counts = categories.map(cat => categoryMap[cat]);

    new Chart(this.booksChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Books',
          data: counts,
          backgroundColor: 'rgba(99, 102, 241, 0.18)',
          borderColor:     '#6366f1',
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: 'rgba(99, 102, 241, 0.32)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f1d1a',
            titleColor: '#f0edf8',
            bodyColor: '#a8a49c',
            padding: 12,
            cornerRadius: 8,
            titleFont: this.baseFont as any,
            bodyFont: { ...this.baseFont, size: 11 } as any
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: this.baseFont as any, color: this.tickColor },
            border: { color: this.gridColor }
          },
          y: {
            grid: { color: this.gridColor },
            ticks: { font: this.baseFont as any, color: this.tickColor },
            border: { color: 'transparent', dash: [4, 4] }
          }
        }
      }
    });
  }

  // ── Line — Issues by month ────────────────────────────────
  renderMonthlyChart(): void {
    if (!this.monthlyChartRef?.nativeElement || !this.issuesStats) return;

    new Chart(this.monthlyChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: Object.keys(this.issuesStats.byMonth),
        datasets: [{
          label: 'Issues',
          data: Object.values(this.issuesStats.byMonth),
          borderColor: '#6366f1',
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(99,102,241,0.18)');
            gradient.addColorStop(1, 'rgba(99,102,241,0.01)');
            return gradient;
          },
          borderWidth: 2,
          fill: true,
          tension: 0.42,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#6366f1',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1f1d1a',
            titleColor: '#f0edf8',
            bodyColor: '#a8a49c',
            padding: 12,
            cornerRadius: 8,
            titleFont: this.baseFont as any,
            bodyFont: { ...this.baseFont, size: 11 } as any
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: this.baseFont as any, color: this.tickColor },
            border: { color: this.gridColor }
          },
          y: {
            grid: { color: this.gridColor },
            ticks: { font: this.baseFont as any, color: this.tickColor },
            border: { color: 'transparent', dash: [4, 4] }
          }
        }
      }
    });
  }
}