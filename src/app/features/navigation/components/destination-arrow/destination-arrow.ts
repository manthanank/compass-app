import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { NavigationService } from '../../../../core/services/navigation';

@Component({
  selector: 'app-destination-arrow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (navigation.destination()) {
      <div
        class="arrow-wrapper"
        [style.transform]="'rotate(' + rotation() + 'deg)'"
        title="Points directly to target destination">
        <div class="arrow">▲</div>
        <div class="arrow-glow"></div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }

    .arrow-wrapper {
      position: relative;
      transition: transform 120ms linear;
      transform-origin: center center;
    }

    .arrow {
      font-size: 54px;
      color: #ef4444;
      line-height: 1;
      filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.8));
      transform: translateY(-90px);
      user-select: none;
    }

    .arrow-glow {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #ef4444;
      border-radius: 50%;
      box-shadow: 0 0 20px 8px #ef4444;
      top: -85px;
      left: 50%;
      transform: translateX(-50%);
    }
  `]
})
export class DestinationArrowComponent {
  protected readonly navigation = inject(NavigationService);
  protected readonly rotation = computed(() => this.navigation.arrowRotation());
}
