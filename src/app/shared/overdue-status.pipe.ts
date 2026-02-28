import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'overdueStatus'
})
export class OverdueStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
