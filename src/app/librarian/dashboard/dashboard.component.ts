import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatsService } from '../stats.service';
import { LoadingSpinnerComponent } from "../../shared/loading.component";

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('issuesChart') issuesChartRef!: ElementRef;
  @ViewChild('booksChart') booksChartRef!: ElementRef;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef;

  dashboardData: any;
  booksStats: any;
  issuesStats: any;

  isLoading = false;
  errorMessage = '';

  constructor(private statsService: StatsService) {}

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
        this.errorMessage = err?.error?.error || 'Failed to load stats';
        this.isLoading = false;
      }
    });
  }

  loadAdditionalCharts(): void {

    this.statsService.getBooksStats().subscribe(res => {
      this.booksStats = res;
      this.renderBooksChart();
    });

    this.statsService.getIssuesStats().subscribe(res => {
      this.issuesStats = res;
      this.renderIssuesChart();
      this.renderMonthlyChart();
      this.isLoading = false;
    });
  }

  renderIssuesChart(): void {
    const ctx = this.issuesChartRef.nativeElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.issuesStats.byStatus),
        datasets: [{
          data: Object.values(this.issuesStats.byStatus),
          backgroundColor: ['#4CAF50', '#FF9800', '#F44336']
        }]
      }
    });
  }

  renderBooksChart(): void {
    const ctx = this.booksChartRef.nativeElement;

    const categories = Object.keys(this.booksStats.byCategory);
    const counts = categories.map(
      (cat: string) => this.booksStats.byCategory[cat].count
    );

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Books per Category',
          data: counts,
          backgroundColor: '#2196F3'
        }]
      }
    });
  }

  renderMonthlyChart(): void {
    const ctx = this.monthlyChartRef.nativeElement;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(this.issuesStats.byMonth),
        datasets: [{
          label: 'Issues by Month',
          data: Object.values(this.issuesStats.byMonth),
          borderColor: '#9C27B0',
          fill: false
        }]
      }
    });
  }
}