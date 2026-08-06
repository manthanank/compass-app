import { Injectable, signal } from '@angular/core';

export type ActivityMode = 'standard' | 'hiking' | 'motorcycle' | 'marine' | 'emergency';

@Injectable({
  providedIn: 'root',
})
export class ActivityModeService {
  readonly currentMode = signal<ActivityMode>('standard');

  setMode(mode: ActivityMode) {
    this.currentMode.set(mode);
  }
}
