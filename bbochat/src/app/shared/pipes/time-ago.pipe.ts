import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  standalone:true,
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | number): string {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  }
}