import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { WeatherService } from '../../../../core/services/weather';
import { LocationService } from '../../../../core/services/location';
import { HeadingNamePipe } from '../../../../shared/pipes/heading-name-pipe';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-marine-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadingNamePipe, IconComponent],
  template: `
    <div class="marine-card">
      <div class="marine-header">
        <div class="title-box">
          <app-icon name="anchor" [size]="20" class="anchor-icon" />
          <span class="title">OFFSHORE MARINE & NAUTICAL COMPASS</span>
        </div>
        <span class="badge">NAUTICAL MODE</span>
      </div>

      <div class="marine-stats">
        <div class="m-box">
          <span class="m-label">SPEED (KNOTS)</span>
          <span class="m-val">{{ speedKnots() }} <small>kts</small></span>
        </div>
        <div class="m-box">
          <span class="m-label">WIND VECTOR</span>
          <span class="m-val">{{ weather.currentWeather().windSpeedKmh }} <small>km/h</small> ({{ weather.currentWeather().windDirectionDeg }}° {{ weather.currentWeather().windDirectionDeg | headingName }})</span>
        </div>
        <div class="m-box">
          <span class="m-label">SWELL HEIGHT</span>
          <span class="m-val">{{ weather.currentWeather().waveHeightMeters }} <small>m</small></span>
        </div>
        <div class="m-box">
          <span class="m-label">TIDE STATE</span>
          <span class="m-val highlight">{{ weather.currentWeather().tideState }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .marine-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .marine-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .anchor-icon {
      color: #38bdf8;
    }

    .title {
      font-size: 14px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.5px;
    }

    .badge {
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 10px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .marine-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 10px;
    }

    .m-box {
      background: var(--color-input-bg, rgba(0, 0, 0, 0.25));
      padding: 10px;
      border-radius: 14px;
      border: 1px solid rgba(56, 189, 248, 0.15);
    }

    .m-label {
      font-size: 9px;
      font-weight: 800;
      color: var(--color-text-muted, #9ca3af);
      letter-spacing: 0.5px;
    }

    .m-val {
      font-size: 15px;
      font-weight: 800;
      color: var(--color-text-main, #fff);
      display: block;
      font-variant-numeric: tabular-nums;
    }

    .m-val.highlight {
      color: #38bdf8;
    }

    .m-val small {
      font-size: 11px;
      color: var(--color-text-muted, #9ca3af);
    }
  `]
})
export class MarineModeComponent {
  protected readonly weather = inject(WeatherService);
  protected readonly location = inject(LocationService);

  speedKnots(): string {
    const spdKmh = this.location.speed() || 0;
    return (spdKmh * 0.539957).toFixed(1);
  }
}
