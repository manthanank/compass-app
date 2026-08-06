import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon';

@Component({
  selector: 'app-stat-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="stat-badge">
      <div class="icon-box">
        <app-icon [name]="iconName()" [size]="18" />
      </div>
      <div class="meta">
        <span class="label">{{ label() }}</span>
        <span class="value">{{ value() }} <small>{{ unit() }}</small></span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      flex: 1;
      min-width: 110px;
    }

    .stat-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--color-input-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
      padding: 10px 14px;
      border-radius: 16px;
      transition: background 0.2s ease, border-color 0.2s ease;
    }

    .stat-badge:hover {
      border-color: var(--color-primary, #ef4444);
    }

    .icon-box {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--color-primary, #ef4444);
      display: grid;
      place-items: center;
    }

    .meta {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text-muted, #9ca3af);
      font-weight: 700;
    }

    .value {
      font-size: 15px;
      font-weight: 800;
      color: var(--color-text-main, #f3f4f6);
      font-variant-numeric: tabular-nums;
    }

    .value small {
      font-size: 11px;
      font-weight: 400;
      color: var(--color-text-muted, #9ca3af);
    }
  `]
})
export class StatBadgeComponent {
  readonly iconName = input<IconName>('gps');
  readonly label = input<string>('');
  readonly value = input<string | number>('--');
  readonly unit = input<string>('');
}
