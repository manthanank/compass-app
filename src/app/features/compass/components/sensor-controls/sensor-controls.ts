import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompassService } from '../../../../core/services/compass';
import { LocationService } from '../../../../core/services/location';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-sensor-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="sensor-card">
      <div class="header-row" (click)="collapsed = !collapsed">
        <div class="title-box">
          <app-icon name="settings" [size]="16" class="icon" />
          <span class="title">Hardware Sensor & Simulator Calibration</span>
        </div>
        <span class="badge" [class.simulating]="compass.isSimulated()">
          {{ compass.isSimulated() ? 'SIMULATION MODE' : 'HARDWARE SENSOR' }}
        </span>
        <button class="toggle-btn">{{ collapsed ? '▼ Expand' : '▲ Collapse' }}</button>
      </div>

      @if (!collapsed) {
        <div class="controls-body">
          <div class="control-group">
            <label>
              <span>Simulate Compass Heading: <strong>{{ simulatedHeading }}°</strong></span>
              <input 
                type="range" 
                min="0" 
                max="359" 
                [(ngModel)]="simulatedHeading" 
                (input)="onHeadingChange()" />
            </label>
          </div>

          <div class="control-row">
            <button class="btn-sm" (click)="compass.toggleSimulation()">
              {{ compass.isSimulated() ? 'Disable Simulation' : 'Enable Manual Slider' }}
            </button>

            <button class="btn-sm" (click)="requestHardwareSensors()">
              Request Sensor Permissions
            </button>
          </div>

          <hr class="divider" />

          <div class="control-group">
            <label>
              <span>Simulate Speed: <strong>{{ simulatedSpeed }} km/h</strong></span>
              <input 
                type="range" 
                min="0" 
                max="120" 
                [(ngModel)]="simulatedSpeed" 
                (input)="onLocationChange()" />
            </label>
          </div>

          <div class="control-group">
            <label>
              <span>Simulate Altitude: <strong>{{ simulatedAlt }} m</strong></span>
              <input 
                type="range" 
                min="0" 
                max="3000" 
                step="10" 
                [(ngModel)]="simulatedAlt" 
                (input)="onLocationChange()" />
            </label>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .sensor-card {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
      border-radius: 18px;
      padding: 14px 18px;
      margin-top: 16px;
    }

    .header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      gap: 10px;
    }

    .title-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-box .icon {
      color: var(--color-primary, #ef4444);
    }

    .title {
      font-size: 13px;
      font-weight: 700;
      color: var(--color-text-main, #e5e7eb);
    }

    .badge {
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 10px;
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }

    .badge.simulating {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: var(--color-text-muted, #9ca3af);
      font-size: 11px;
      cursor: pointer;
    }

    .controls-body {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .control-group label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
      color: var(--color-text-muted, #9ca3af);
    }

    .control-group label strong {
      color: var(--color-text-main, #fff);
    }

    input[type='range'] {
      accent-color: var(--color-primary, #ef4444);
      cursor: pointer;
    }

    .control-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn-sm {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-main, #d1d5db);
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .btn-sm:hover {
      border-color: var(--color-primary, #ef4444);
    }

    .divider {
      border: none;
      border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
      margin: 4px 0;
    }
  `]
})
export class SensorControlsComponent {
  protected readonly compass = inject(CompassService);
  protected readonly location = inject(LocationService);

  collapsed = true;
  simulatedHeading = 348;
  simulatedSpeed = 18;
  simulatedAlt = 412;

  onHeadingChange() {
    this.compass.setSimulatedHeading(this.simulatedHeading);
  }

  onLocationChange() {
    const lat = this.location.latitude() || 15.4920;
    const lon = this.location.longitude() || 73.8278;
    this.location.setSimulatedLocation(lat, lon, this.simulatedAlt, this.simulatedSpeed);
  }

  requestHardwareSensors() {
    this.compass.requestPermission();
  }
}
