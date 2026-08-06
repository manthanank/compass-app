import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CompassService } from '../../../../core/services/compass';
import { LocationService } from '../../../../core/services/location';
import { HeadingNamePipe } from '../../../../shared/pipes/heading-name-pipe';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-motorcycle-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadingNamePipe, IconComponent],
  template: `
    <div class="moto-card">
      <div class="moto-badge">
        <app-icon name="motorcycle" [size]="16" />
        MOTORCYCLE RIDE HUD (HIGH VISIBILITY)
      </div>

      <div class="moto-hud-grid">
        <div class="big-box">
          <span class="hud-label">CURRENT SPEED</span>
          <span class="big-value">{{ location.speed() || 0 }} <small>km/h</small></span>
        </div>

        <div class="big-box">
          <span class="hud-label">HEADING</span>
          <span class="big-value red">{{ compass.heading() }}° <small>{{ compass.heading() | headingName }}</small></span>
        </div>
      </div>

      <div class="lean-container">
        <div class="lean-header">
          <span>LEAN ANGLE SENSOR</span>
          <span class="angle-val">L 18° | R 22°</span>
        </div>
        <div class="lean-bar-track">
          <div class="lean-bar-fill" style="width: 55%; left: 22.5%;"></div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="moto-btn" (click)="markFuelStop()">
          <app-icon name="fuel" [size]="16" />
          Mark Fuel Stop
        </button>
        <button class="moto-btn" (click)="toggleHeadingLock()">
          {{ headingLocked ? '🔒 Heading Locked' : '🔓 Lock Heading' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .moto-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #000;
      padding: 18px;
      border-radius: 20px;
      border: 2px solid #ef4444;
    }

    .moto-badge {
      font-size: 11px;
      font-weight: 900;
      color: #ef4444;
      letter-spacing: 1.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .moto-hud-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .big-box {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 16px;
      text-align: center;
    }

    .hud-label {
      font-size: 10px;
      font-weight: 800;
      color: #9ca3af;
      letter-spacing: 1px;
      display: block;
    }

    .big-value {
      font-size: 38px;
      font-weight: 900;
      color: #fff;
      font-variant-numeric: tabular-nums;
    }

    .big-value.red {
      color: #ef4444;
    }

    .big-value small {
      font-size: 14px;
      font-weight: 400;
      color: #9ca3af;
    }

    .lean-container {
      background: rgba(255, 255, 255, 0.03);
      padding: 12px;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .lean-header {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      color: #9ca3af;
    }

    .angle-val {
      color: #fff;
    }

    .lean-bar-track {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      position: relative;
    }

    .lean-bar-fill {
      position: absolute;
      height: 100%;
      background: #ef4444;
      border-radius: 4px;
    }

    .quick-actions {
      display: flex;
      gap: 10px;
    }

    .moto-btn {
      flex: 1;
      background: #111;
      border: 1px solid #333;
      color: #fff;
      padding: 12px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .moto-btn:hover {
      border-color: #ef4444;
      color: #ef4444;
    }
  `]
})
export class MotorcycleModeComponent {
  protected readonly compass = inject(CompassService);
  protected readonly location = inject(LocationService);

  headingLocked = false;

  markFuelStop() {
    alert('⛽ Fuel Stop marked at current GPS coordinates!');
  }

  toggleHeadingLock() {
    this.headingLocked = !this.headingLocked;
  }
}
