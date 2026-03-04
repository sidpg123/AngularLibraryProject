import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Issue } from '../../models/issue.model';
import { FineCalculationPreview } from '../../models/fine.model';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './issue-card.component.html',
  styleUrl: './issue-card.component.css'
})
export class IssueCardComponent {

  @Input() issue!: Issue;
  @Input() calculatedFine?: FineCalculationPreview;
  @Input() index: number = 0;

  @Output() viewDetails = new EventEmitter<number>();

  onDetailsClick(): void {
    this.viewDetails.emit(this.issue.id);
  }
}