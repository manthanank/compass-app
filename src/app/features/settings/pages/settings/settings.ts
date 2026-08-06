import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompassService } from '../../../../core/services/compass';
import { ThemeService } from '../../../../core/services/theme';
import { CardComponent } from '../../../../shared/components/card/card';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardComponent, HeaderComponent, BottomNavComponent, IconComponent],
  template: `
    <div class="page-container">
      <app-header />

      <app-card>
        <div class="settings-header">
          <h2>
            <app-icon name="settings" [size]="20" class="header-icon" />
            Compass Configuration & Calibration
          </h2>
        </div>

        <div class="settings-group">
          <h3>🧭 Sensor Alignment</h3>
          
          <div class="setting-item">
            <div class="setting-meta">
              <span class="setting-title">True North Correction</span>
              <span class="setting-desc">Adjust heading calculations using local magnetic declination</span>
            </div>
            <button class="toggle-btn" [class.on]="compass.useTrueNorth()" (click)="compass.toggleTrueNorth()">
              {{ compass.useTrueNorth() ? 'ON (True North)' : 'OFF (Magnetic)' }}
            </button>
          </div>

          <div class="setting-item">
            <div class="setting-meta">
              <span class="setting-title">Magnetic Declination Offset</span>
              <span class="setting-desc">Local variation angle: {{ compass.magneticDeclination() }}°</span>
            </div>
            <input 
              type="number" 
              class="num-input"
              [ngModel]="compass.magneticDeclination()" 
              (ngModelChange)="compass.setDeclination($event)" />
          </div>
        </div>

        <hr class="divider" />

        <div class="settings-group">
          <h3>🎨 Display Theme</h3>

          <div class="setting-item">
            <div class="setting-meta">
              <span class="setting-title">Dark AMOLED Interface</span>
              <span class="setting-desc">High-contrast battery saving display profile</span>
            </div>
            <button class="toggle-btn" [class.on]="theme.dark()" (click)="theme.toggle()">
              {{ theme.dark() ? 'DARK MODE' : 'LIGHT MODE' }}
            </button>
          </div>
        </div>

        <hr class="divider" />

        <div class="settings-group">
          <h3>🧲 Magnetometer Recalibration</h3>
          <div class="calibration-box">
            <div class="calib-icon-box">
              <app-icon name="target" [size]="24" />
            </div>
            <div class="guide-text">
              <h4>Execute Figure-Eight (♾️) Recalibration</h4>
              <p>If sensor heading stutters or drifts near metallic interference, rotate device continuously in a smooth figure-eight loop to re-center 3-axis magnetometer zero points.</p>
            </div>
          </div>
        </div>
      </app-card>

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 800px;
      margin: auto;
      padding: 24px;
      padding-bottom: 100px;
    }

    .settings-header h2 {
      font-size: 18px;
      font-weight: 800;
      margin: 0 0 20px 0;
      color: var(--color-text-main, #fff);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon {
      color: var(--color-primary, #ef4444);
    }

    .settings-group {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .settings-group h3 {
      font-size: 13px;
      font-weight: 800;
      color: var(--color-primary, #ef4444);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: var(--color-input-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
      padding: 12px 16px;
      border-radius: 14px;
    }

    .setting-meta {
      display: flex;
      flex-direction: column;
    }

    .setting-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--color-text-main, #fff);
    }

    .setting-desc {
      font-size: 11px;
      color: var(--color-text-muted, #9ca3af);
    }

    .toggle-btn {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-muted, #9ca3af);
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .toggle-btn.on {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
      color: #10b981;
    }

    .num-input {
      width: 70px;
      background: var(--color-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-main, #fff);
      padding: 8px;
      border-radius: 10px;
      font-family: inherit;
      text-align: center;
    }

    .divider {
      border: none;
      border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
      margin: 20px 0;
    }

    .calibration-box {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: 16px;
      border-radius: 16px;
    }

    .calib-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .guide-text h4 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: var(--color-text-main, #fff);
    }

    .guide-text p {
      font-size: 12px;
      color: var(--color-text-muted, #d1d5db);
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class SettingsComponent {
  protected readonly compass = inject(CompassService);
  protected readonly theme = inject(ThemeService);
}
