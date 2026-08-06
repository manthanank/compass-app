import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavigationService } from '../../../../core/services/navigation';
import { DistancePipe } from '../../../../shared/pipes/distance-pipe';
import { HeadingNamePipe } from '../../../../shared/pipes/heading-name-pipe';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-nav-hud',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DistancePipe, HeadingNamePipe, IconComponent],
  template: `
    @if (navigation.destination(); as dest) {
      <div class="nav-hud">
        <div class="hud-top">
          <div class="dest-info">
            <span class="dest-label">TARGET NAVIGATION WAYPOINT</span>
            <h2 class="dest-name">
              <app-icon name="places" [size]="18" class="icon" />
              {{ dest.name }}
            </h2>
          </div>
          <button class="clear-btn" (click)="navigation.clearDestination()" title="Clear destination">
            ✕
          </button>
        </div>

        <div class="hud-stats">
          <div class="stat-box">
            <span class="stat-title">DISTANCE TO TARGET</span>
            <span class="stat-value highlight">{{ navigation.distance() | distance }}</span>
          </div>

          <div class="stat-box">
            <span class="stat-title">BEARING VECTOR</span>
            <span class="stat-value">
              {{ navigation.bearing() }}° 
              <small>({{ navigation.bearing() | headingName }})</small>
            </span>
          </div>

          <div class="stat-box">
            <span class="stat-title">ESTIMATED ETE</span>
            <span class="stat-value">{{ navigation.etaMinutes() }} <small>min</small></span>
          </div>
        </div>
      </div>
    } @else {
      <div class="no-dest-card">
        <div class="no-dest-icon">
          <app-icon name="target" [size]="28" />
        </div>
        <div class="text">
          <h3>No Active Waypoint Target</h3>
          <p>Tap anywhere on the live satellite map below or select a saved location to engage direct vector navigation.</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .nav-hud {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .hud-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .dest-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--color-primary, #ef4444);
    }

    .dest-name {
      font-size: 17px;
      font-weight: 800;
      color: var(--color-text-main, #fff);
      margin: 3px 0 0 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dest-name .icon {
      color: var(--color-primary, #ef4444);
    }

    .clear-btn {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-muted, #9ca3af);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: grid;
      place-items: center;
    }

    .clear-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .hud-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
    }

    .stat-box {
      background: var(--color-input-bg, rgba(0, 0, 0, 0.25));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.05));
      padding: 10px 14px;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-title {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1px;
      color: var(--color-text-muted, #9ca3af);
    }

    .stat-value {
      font-size: 16px;
      font-weight: 800;
      color: var(--color-text-main, #f3f4f6);
      font-variant-numeric: tabular-nums;
    }

    .stat-value.highlight {
      color: var(--color-primary, #ef4444);
    }

    .stat-value small {
      font-size: 11px;
      font-weight: 400;
      color: var(--color-text-muted, #9ca3af);
    }

    .no-dest-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 4px;
    }

    .no-dest-icon {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--color-primary, #ef4444);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .no-dest-card h3 {
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 2px 0;
      color: var(--color-text-main, #fff);
    }

    .no-dest-card p {
      font-size: 12px;
      color: var(--color-text-muted, #9ca3af);
      margin: 0;
      line-height: 1.4;
    }
  `]
})
export class NavHudComponent {
  protected readonly navigation = inject(NavigationService);
}
