import { Injectable, computed, inject, signal } from '@angular/core';
import { LocationService } from './location';
import { CompassService } from './compass';
import { calculateBearing, calculateDistance } from '../utils/geo.util';
import { Destination } from '../../models/destination.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly location = inject(LocationService);
  private readonly compass = inject(CompassService);

  readonly destination = signal<Destination | null>({
    id: 'default-home',
    name: 'Camp Site / Home Base',
    latitude: 15.5000,
    longitude: 73.8350,
    category: 'camp',
    notes: 'Primary outdoor campsite location',
  });

  readonly distance = computed(() => {
    const d = this.destination();
    if (!d) return null;
    const lat = this.location.latitude();
    const lon = this.location.longitude();
    if (lat == null || lon == null) return null;
    return Math.round(calculateDistance(lat, lon, d.latitude, d.longitude));
  });

  readonly bearing = computed(() => {
    const d = this.destination();
    if (!d) return null;
    const lat = this.location.latitude();
    const lon = this.location.longitude();
    if (lat == null || lon == null) return null;
    return Math.round(calculateBearing(lat, lon, d.latitude, d.longitude));
  });

  readonly arrowRotation = computed(() => {
    const currentHeading = this.compass.heading();
    const targetBearing = this.bearing();
    if (targetBearing == null) return 0;
    return (targetBearing - currentHeading + 360) % 360;
  });

  readonly etaMinutes = computed(() => {
    const distMeters = this.distance();
    if (!distMeters) return null;
    const speedKmh = this.location.speed() || 5;
    const speedMs = (speedKmh * 1000) / 3600;
    const seconds = distMeters / speedMs;
    return Math.max(1, Math.round(seconds / 60));
  });

  setDestination(dest: Destination) {
    this.destination.set(dest);
  }

  clearDestination() {
    this.destination.set(null);
  }
}
