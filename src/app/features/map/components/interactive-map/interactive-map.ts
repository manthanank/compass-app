import { Component, ChangeDetectionStrategy, ElementRef, AfterViewInit, OnDestroy, ViewChild, inject, effect } from '@angular/core';
import { LocationService } from '../../../../core/services/location';
import { NavigationService } from '../../../../core/services/navigation';
import { CompassService } from '../../../../core/services/compass';
import * as L from 'leaflet';

@Component({
  selector: 'app-interactive-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map-wrapper">
      <div class="map-header">
        <span class="map-title">🗺️ Live Satellite & Terrain Map</span>
        <div class="map-controls">
          <button class="map-btn" (click)="centerOnUser()" title="Recenter on current GPS location">
            🎯 Recenter
          </button>
        </div>
      </div>

      <div #mapContainer class="leaflet-map-container"></div>
      
      <div class="map-footer-hint">
        💡 Tap anywhere on the map to set a new destination target line.
      </div>
    </div>
  `,
  styles: [`
    .map-wrapper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .map-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .map-title {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .map-btn {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .map-btn:hover {
      background: rgba(239, 68, 68, 0.3);
    }

    .leaflet-map-container {
      width: 100%;
      height: 280px;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
      z-index: 1;
    }

    .map-footer-hint {
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
    }
  `]
})
export class InteractiveMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  protected readonly location = inject(LocationService);
  protected readonly navigation = inject(NavigationService);
  protected readonly compass = inject(CompassService);

  private map: L.Map | null = null;
  private userMarker: L.CircleMarker | null = null;
  private destMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;

  constructor() {
    effect(() => {
      const lat = this.location.latitude();
      const lon = this.location.longitude();
      const dest = this.navigation.destination();
      if (this.map && lat != null && lon != null) {
        this.updateMapState(lat, lon, dest);
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  centerOnUser() {
    const lat = this.location.latitude();
    const lon = this.location.longitude();
    if (this.map && lat != null && lon != null) {
      this.map.setView([lat, lon], 14, { animate: true });
    }
  }

  private initMap() {
    const defaultLat = this.location.latitude() || 15.4920;
    const defaultLon = this.location.longitude() || 73.8278;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [defaultLat, defaultLon],
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.navigation.setDestination({
        id: 'pinned_' + Date.now(),
        name: `Pinned Target (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        latitude: lat,
        longitude: lng,
        category: 'custom',
        createdAt: Date.now(),
      });
    });

    this.updateMapState(defaultLat, defaultLon, this.navigation.destination());
  }

  private updateMapState(userLat: number, userLon: number, dest: any) {
    if (!this.map) return;

    if (!this.userMarker) {
      this.userMarker = L.circleMarker([userLat, userLon], {
        radius: 8,
        fillColor: '#ef4444',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 3,
      }).addTo(this.map);
    } else {
      this.userMarker.setLatLng([userLat, userLon]);
    }

    if (dest) {
      const destLatLng: [number, number] = [dest.latitude, dest.longitude];

      const destIcon = L.divIcon({
        className: 'custom-dest-pin',
        html: `<div style="font-size:24px; filter:drop-shadow(0 0 8px #ef4444);">📍</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      if (!this.destMarker) {
        this.destMarker = L.marker(destLatLng, { icon: destIcon }).addTo(this.map);
      } else {
        this.destMarker.setLatLng(destLatLng);
      }

      const lineCoords: [number, number][] = [[userLat, userLon], destLatLng];
      if (!this.routeLine) {
        this.routeLine = L.polyline(lineCoords, {
          color: '#ef4444',
          weight: 3,
          dashArray: '6, 8',
        }).addTo(this.map);
      } else {
        this.routeLine.setLatLngs(lineCoords);
      }
    } else {
      if (this.destMarker) {
        this.destMarker.remove();
        this.destMarker = null;
      }
      if (this.routeLine) {
        this.routeLine.remove();
        this.routeLine = null;
      }
    }
  }
}
