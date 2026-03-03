import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysUntil',
  standalone: true
})
export class DaysUntilPipe implements PipeTransform {

  transform(date: string | Date): number {
    const target = new Date(date).getTime();
    const today = new Date().getTime();

    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}