import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from '../models/issue.model';

@Pipe({
  name: 'issueCount',
  standalone: true
})
export class IssueCountPipe implements PipeTransform {

  transform(issues: Issue[], status: 'issued' | 'overdue' | 'returned'): number {

    if (!issues) return 0;

    return issues.filter(issue => issue.status === status).length;

  }

}