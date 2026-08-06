import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { LocationService } from '../../../../core/services/location';
import { formatDMS } from '../../../../core/utils/geo.util';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-emergency-sos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <div class="sos-card" [class.strobe-active]="isStrobeActive()">
      <div class="sos-header">
        <div class="header-title-box">
          <app-icon name="sos" [size]="20" class="sos-icon" />
          <span class="title">EMERGENCY SOS & BEACON TRANSMITTER</span>
        </div>
        <span class="pulse-dot"></span>
      </div>

      <div class="coords-box">
        <span class="coords-label">EXACT EMERGENCY COORDINATES (DMS & DECIMAL)</span>
        <div class="dms-val">{{ dmsCoordinates() }}</div>
        <div class="dec-val">LAT: {{ location.latitude() }} | LON: {{ location.longitude() }}</div>
        <div class="alt-val">ALT: {{ location.altitude() }}m | ACCURACY: ±{{ location.accuracy() }}m</div>
      </div>

      <div class="sos-actions">
        <button class="sos-btn danger" (click)="toggleStrobe()">
          {{ isStrobeActive() ? '⬛ STOP SOS STROBE' : '🚨 START VISUAL STROBE' }}
        </button>

        <button class="sos-btn" (click)="copyLocationPayload()">
          <app-icon name="copy" [size]="14" />
          Copy Emergency SMS Payload
        </button>
      </div>

      @if (showToast()) {
        <div class="copied-toast">
          ✓ Emergency SOS Payload copied to clipboard!
        </div>
      }
    </div>
  `,
  styles: [`
    .sos-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: rgba(239, 68, 68, 0.08);
      border: 2px solid #ef4444;
      padding: 18px;
      border-radius: 20px;
      transition: background 0.1s ease;
    }

    .sos-card.strobe-active {
      animation: strobe 0.3s infinite alternate;
    }

    @keyframes strobe {
      0% { background: #ef4444; color: #fff; }
      100% { background: #000; color: #ef4444; }
    }

    .sos-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-title-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sos-icon {
      color: #ef4444;
    }

    .title {
      font-size: 13px;
      font-weight: 800;
      color: #ef4444;
      letter-spacing: 1px;
    }

    .pulse-dot {
      width: 10px;
      height: 10px;
      background: #ef4444;
      border-radius: 50%;
      box-shadow: 0 0 10px #ef4444;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }

    .coords-box {
      background: rgba(0, 0, 0, 0.4);
      padding: 14px;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .coords-label {
      font-size: 9px;
      font-weight: 800;
      color: #9ca3af;
      letter-spacing: 1px;
    }

    .dms-val {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      margin-top: 4px;
      font-family: monospace;
    }

    .dec-val, .alt-val {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 2px;
      font-family: monospace;
    }

    .sos-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .sos-btn {
      flex: 1;
      min-width: 140px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 12px;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .sos-btn.danger {
      background: #ef4444;
      border-color: #ef4444;
    }

    .sos-btn:hover {
      opacity: 0.9;
    }

    .copied-toast {
      font-size: 12px;
      color: #10b981;
      text-align: center;
      font-weight: 700;
    }
  `]
})
export class EmergencySosComponent {
  protected readonly location = inject(LocationService);

  isStrobeActive = signal<boolean>(false);
  showToast = signal<boolean>(false);

  dmsCoordinates(): string {
    const lat = this.location.latitude() || 15.4920;
    const lon = this.location.longitude() || 73.8278;
    return `${formatDMS(lat, true)}, ${formatDMS(lon, false)}`;
  }

  toggleStrobe() {
    this.isStrobeActive.update((v) => !v);
  }

  copyLocationPayload() {
    const lat = this.location.latitude() || 15.4920;
    const lon = this.location.longitude() || 73.8278;
    const payload = `🚨 EMERGENCY SOS BEACON! My current location is:\nLatitude: ${lat}\nLongitude: ${lon}\nDMS: ${this.dmsCoordinates()}\nMaps: https://maps.google.com/?q=${lat},${lon}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payload);
      this.showToast.set(true);
      setTimeout(() => this.showToast.set(false), 3000);
    }
  }
}
