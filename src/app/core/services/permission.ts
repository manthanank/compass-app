import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  readonly gpsGranted = signal<boolean>(true);
  readonly orientationGranted = signal<boolean>(true);

  checkSensorPermissions(): boolean {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      this.gpsGranted.set(true);
    }
    return this.gpsGranted() && this.orientationGranted();
  }
}
