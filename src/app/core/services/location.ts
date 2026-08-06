import { Injectable, signal, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService implements OnDestroy {
  readonly latitude = signal<number | null>(15.4920);
  readonly longitude = signal<number | null>(73.8278);
  readonly altitude = signal<number | null>(412);
  readonly speed = signal<number | null>(0);
  readonly accuracy = signal<number | null>(3);
  readonly isSimulatedLocation = signal<boolean>(false);
  readonly trackingActive = signal<boolean>(false);

  private watchId: number | null = null;

  constructor() {
    this.startTracking();
  }

  ngOnDestroy() {
    this.stopTracking();
  }

  startTracking() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    this.trackingActive.set(true);
    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (this.isSimulatedLocation()) return;

        this.latitude.set(pos.coords.latitude);
        this.longitude.set(pos.coords.longitude);
        this.altitude.set(pos.coords.altitude != null ? Math.round(pos.coords.altitude) : 412);
        
        if (pos.coords.speed != null && pos.coords.speed > 0) {
          this.speed.set(Math.round(pos.coords.speed * 3.6));
        } else if (!this.isSimulatedLocation()) {
          this.speed.set(0);
        }

        this.accuracy.set(pos.coords.accuracy != null ? Math.round(pos.coords.accuracy) : 5);
      },
      (err) => {
        console.warn('[LocationService]: Geolocation notice:', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 3000,
      }
    );
  }

  stopTracking() {
    if (this.watchId !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.trackingActive.set(false);
  }

  setSimulatedLocation(lat: number, lon: number, alt = 412, spd = 18, acc = 3) {
    this.isSimulatedLocation.set(true);
    this.latitude.set(lat);
    this.longitude.set(lon);
    this.altitude.set(alt);
    this.speed.set(spd);
    this.accuracy.set(acc);
  }

  toggleSimulation() {
    this.isSimulatedLocation.update((v) => !v);
  }
}
