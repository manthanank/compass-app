import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: var(--color-surface, rgba(26, 28, 34, 0.85));
      color: var(--color-text-main, #f3f4f6);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.07));
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
    }

    .card:hover {
      border-color: var(--color-primary, #ef4444);
    }
  `]
})
export class CardComponent {}
