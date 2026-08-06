import { Pipe, PipeTransform } from '@angular/core';
import { getCardinalDirection } from '../../core/utils/geo.util';

@Pipe({
  name: 'headingName',
})
export class HeadingNamePipe implements PipeTransform {
  transform(deg: number | null | undefined): string {
    if (deg == null || isNaN(deg)) return '--';
    return getCardinalDirection(deg);
  }
}
