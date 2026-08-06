import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivityModeService, ActivityMode } from '../../../core/services/activity-mode';
import { CompassService } from '../../../core/services/compass';
import { ThemeService } from '../../../core/services/theme';
import { TrackService } from '../../../core/services/track';
import { IconComponent, IconName } from '../icon/icon';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <header class="header">
      <div class="brand">
        <div class="logo-box">
          <app-icon name="compass" [size]="24" />
        </div>
        <div class="title-group">
          <div class="brand-row">
            <h1>APEX TACTICAL</h1>
            <span class="version-badge">v2.4 PRO</span>
          </div>
          <span class="subtitle">PRECISION SENSOR TELEMETRY</span>
        </div>
      </div>

      <div class="modes">
        @for (m of modes; track m.id) {
          <button 
            class="mode-pill" 
            [class.active]="modeService.currentMode() === m.id"
            [class.sos]="m.id === 'emergency'"
            (click)="modeService.setMode(m.id)">
            <app-icon [name]="m.icon" [size]="14" />
            <span class="mode-name">{{ m.label }}</span>
          </button>
        }
      </div>

      <div class="header-actions">
        <div class="visitor-count" title="Unique Project Visitors">
          <app-icon name="users" [size]="13" />
          <strong>{{ trackService.uniqueVisitors() }}</strong>
        </div>

        <button class="badge-btn" (click)="compass.toggleTrueNorth()">
          {{ compass.useTrueNorth() ? 'TRUE N' : 'MAG N' }}
        </button>

        <button class="icon-btn" (click)="theme.toggle()" title="Toggle Theme">
          <app-icon [name]="theme.dark() ? 'moon' : 'sun'" [size]="15" />
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 14px 20px;
      background: var(--color-surface, rgba(26, 28, 34, 0.7));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 20px;
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
      margin-bottom: 20px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: background 0.3s ease, border-color 0.3s ease;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-box {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.05));
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--color-primary, #ef4444);
      display: grid;
      place-items: center;
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-group h1 {
      font-size: clamp(14px, 3.5vw, 16px);
      font-weight: 900;
      color: var(--color-text-main, #f9fafb);
      margin: 0;
      letter-spacing: 0.5px;
    }

    .version-badge {
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      letter-spacing: 0.5px;
    }

    .subtitle {
      font-size: 9px;
      font-weight: 700;
      color: var(--color-text-muted, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 1px;
      display: block;
    }

    .modes {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 4px 0;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .modes::-webkit-scrollbar {
      display: none;
    }

    .mode-pill {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
      color: var(--color-text-main, #d1d5db);
      padding: 7px 13px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .mode-pill:hover {
      border-color: var(--color-primary, #ef4444);
    }

    .mode-pill.active {
      background: var(--color-primary, #ef4444);
      color: white;
      border-color: var(--color-primary, #ef4444);
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
    }

    .mode-pill.sos {
      border-color: rgba(239, 68, 68, 0.4);
    }

    .mode-pill.sos.active {
      animation: pulse-sos 1.5s infinite;
    }

    @keyframes pulse-sos {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .visitor-count {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      color: var(--color-text-muted, #9ca3af);
      background: var(--color-input-bg, rgba(255, 255, 255, 0.04));
      padding: 6px 10px;
      border-radius: 12px;
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
    }

    .visitor-count strong {
      color: var(--color-text-main, #e5e7eb);
      font-family: monospace;
    }

    .badge-btn {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 6px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: 0.5px;
      transition: all 0.2s ease;
    }

    .badge-btn:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    .icon-btn {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-main, #fff);
      width: 32px;
      height: 32px;
      border-radius: 10px;
      cursor: pointer;
      display: grid;
      place-items: center;
    }

    @media (max-width: 600px) {
      .header {
        padding: 12px 14px;
      }

      .modes {
        order: 3;
        width: 100%;
        margin-top: 4px;
      }
    }
  `]
})
export class HeaderComponent {
  protected readonly modeService = inject(ActivityModeService);
  protected readonly compass = inject(CompassService);
  protected readonly theme = inject(ThemeService);
  protected readonly trackService = inject(TrackService);

  protected readonly modes: { id: ActivityMode; label: string; icon: IconName }[] = [
    { id: 'standard', label: 'Standard', icon: 'compass' },
    { id: 'hiking', label: 'Hiking', icon: 'hiking' },
    { id: 'motorcycle', label: 'Motorcycle', icon: 'motorcycle' },
    { id: 'marine', label: 'Marine', icon: 'anchor' },
    { id: 'emergency', label: 'SOS', icon: 'sos' },
  ];
}
