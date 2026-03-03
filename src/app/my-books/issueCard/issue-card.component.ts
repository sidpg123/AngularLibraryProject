import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../models/issue.model';
import { FineCalculationPreview } from '../../models/fine.model';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issue-card.component.html'
})
export class IssueCardComponent {

  @Input() issue!: Issue;
  @Output() viewDetails = new EventEmitter<number>();
  @Input() calculatedFine?: FineCalculationPreview;
  constructor() {}
  onDetailsClick(): void {
    this.viewDetails.emit(this.issue.id);
  }
}