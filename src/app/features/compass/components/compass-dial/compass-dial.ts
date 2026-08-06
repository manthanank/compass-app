import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CompassService } from '../../../../core/services/compass';
import { HeadingNamePipe } from '../../../../shared/pipes/heading-name-pipe';
import { DestinationArrowComponent } from '../../../navigation/components/destination-arrow/destination-arrow';

@Component({
  selector: 'app-compass-dial',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadingNamePipe, DestinationArrowComponent],
  templateUrl: './compass-dial.html',
  styleUrl: './compass-dial.css',
})
export class CompassDialComponent {
  protected readonly compass = inject(CompassService);
}
