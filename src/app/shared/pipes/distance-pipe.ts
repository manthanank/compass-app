import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {
  transform(meters: number | null | undefined): string {
    if (meters == null || isNaN(meters)) return '-- m';
    if (meters >= 1000) {
      const km = (meters / 1000).toFixed(1);
      return `${km} km`;
    }
    return `${Math.round(meters)} m`;
  }
}
