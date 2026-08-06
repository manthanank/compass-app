import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { LocationService } from '../../../../core/services/location';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-hiking-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="hiking-card">
      <div class="hiking-header">
        <div class="title-box">
          <app-icon name="hiking" [size]="20" class="hiking-icon" />
          <span class="title">HIKING & TRAIL TELEMETRY</span>
        </div>
        <button 
          class="record-btn" 
          [class.recording]="isRecording()" 
          (click)="toggleTrailRecording()">
          {{ isRecording() ? '🔴 Recording Trail...' : '▶ Start Trail Recording' }}
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <span class="label">ELEVATION GAIN</span>
          <span class="value">+184 <small>m</small></span>
        </div>
        <div class="stat-box">
          <span class="label">CURRENT ALTITUDE</span>
          <span class="value">{{ location.altitude() }} <small>m</small></span>
        </div>
        <div class="stat-box">
          <span class="label">HIKE DURATION</span>
          <span class="value">{{ formattedDuration() }}</span>
        </div>
        <div class="stat-box">
          <span class="label">WAYPOINTS</span>
          <span class="value">{{ waypointsCount() }}</span>
        </div>
      </div>

      <div class="elevation-profile">
        <span class="chart-title">Elevation Profile (Trail Track)</span>
        <div class="chart-bars">
          <div class="bar" style="height: 40%"></div>
          <div class="bar" style="height: 55%"></div>
          <div class="bar" style="height: 70%"></div>
          <div class="bar" style="height: 65%"></div>
          <div class="bar" style="height: 85%"></div>
          <div class="bar" style="height: 95%"></div>
          <div class="bar" style="height: 90%"></div>
          <div class="bar" style="height: 75%"></div>
          <div class="bar" style="height: 80%"></div>
          <div class="bar" style="height: 100%"></div>
        </div>
      </div>

      <div class="action-row">
        <button class="action-btn" (click)="addWaypoint()">
          <app-icon name="places" [size]="14" />
          Mark Waypoint
        </button>
        <button class="action-btn" (click)="exportGPX()">
          <app-icon name="copy" [size]="14" />
          Export GPX File
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hiking-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .hiking-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .title-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hiking-icon {
      color: var(--color-primary, #ef4444);
    }

    .title {
      font-size: 14px;
      font-weight: 800;
      color: var(--color-text-main, #fff);
      letter-spacing: 0.5px;
    }

    .record-btn {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10b981;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .record-btn.recording {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #ef4444;
      animation: blink 1.5s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 10px;
    }

    .stat-box {
      background: var(--color-input-bg, rgba(0, 0, 0, 0.25));
      padding: 10px;
      border-radius: 14px;
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.05));
    }

    .label {
      font-size: 9px;
      font-weight: 800;
      color: var(--color-text-muted, #9ca3af);
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 16px;
      font-weight: 800;
      color: var(--color-text-main, #fff);
      display: block;
      font-variant-numeric: tabular-nums;
    }

    .value small {
      font-size: 11px;
      color: var(--color-text-muted, #9ca3af);
    }

    .elevation-profile {
      background: var(--color-input-bg, rgba(0, 0, 0, 0.3));
      border-radius: 14px;
      padding: 12px;
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.05));
    }

    .chart-title {
      font-size: 10px;
      font-weight: 800;
      color: var(--color-text-muted, #9ca3af);
      text-transform: uppercase;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 48px;
      margin-top: 8px;
    }

    .bar {
      flex: 1;
      background: linear-gradient(to top, #ef4444, #f59e0b);
      border-radius: 4px;
    }

    .action-row {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      flex: 1;
      background: var(--color-input-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-main, #e5e7eb);
      padding: 10px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .action-btn:hover {
      border-color: var(--color-primary, #ef4444);
    }
  `]
})
export class HikingModeComponent {
  protected readonly location = inject(LocationService);

  isRecording = signal<boolean>(false);
  waypointsCount = signal<number>(2);
  secondsElapsed = signal<number>(1420);

  toggleTrailRecording() {
    this.isRecording.update((v) => !v);
  }

  addWaypoint() {
    this.waypointsCount.update((v) => v + 1);
  }

  formattedDuration(): string {
    const totalSecs = this.secondsElapsed();
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    return `${hrs}h ${mins}m`;
  }

  exportGPX() {
    const lat = this.location.latitude() || 15.4920;
    const lon = this.location.longitude() || 73.8278;
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Apex Outdoor Compass">
  <trk>
    <name>Apex Hiking Trail Track</name>
    <trkpt lat="${lat}" lon="${lon}">
      <ele>${this.location.altitude() || 412}</ele>
      <time>${new Date().toISOString()}</time>
    </trkpt>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trail_track_${Date.now()}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
