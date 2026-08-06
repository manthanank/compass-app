import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CompassDialComponent } from '../../../compass/components/compass-dial/compass-dial';
import { SensorControlsComponent } from '../../../compass/components/sensor-controls/sensor-controls';
import { NavHudComponent } from '../../../navigation/components/nav-hud/nav-hud';
import { InteractiveMapComponent } from '../../../map/components/interactive-map/interactive-map';
import { HikingModeComponent } from '../../../modes/components/hiking-mode/hiking-mode';
import { MotorcycleModeComponent } from '../../../modes/components/motorcycle-mode/motorcycle-mode';
import { MarineModeComponent } from '../../../modes/components/marine-mode/marine-mode';
import { EmergencySosComponent } from '../../../modes/components/emergency-sos/emergency-sos';
import { CardComponent } from '../../../../shared/components/card/card';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { StatBadgeComponent } from '../../../../shared/components/stat-badge/stat-badge';
import { LocationService } from '../../../../core/services/location';
import { ActivityModeService } from '../../../../core/services/activity-mode';
import { SeoService } from '../../../../core/services/seo';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CompassDialComponent,
    SensorControlsComponent,
    NavHudComponent,
    InteractiveMapComponent,
    HikingModeComponent,
    MotorcycleModeComponent,
    MarineModeComponent,
    EmergencySosComponent,
    CardComponent,
    BottomNavComponent,
    HeaderComponent,
    StatBadgeComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  protected readonly location = inject(LocationService);
  protected readonly modeService = inject(ActivityModeService);

  constructor() {
    inject(SeoService).setPageSeo(
      'Real-time Outdoor Compass & Telemetry Dashboard',
      'Interactive digital compass with true north, GPS coordinates, elevation telemetry, live map, and outdoor activity modes.'
    );
  }
}
