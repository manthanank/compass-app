import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { lowPassFilter, normalizeAngle } from '../utils/math.util';

@Injectable({
  providedIn: 'root',
})
export class CompassService implements OnDestroy {
  readonly rawHeading = signal<number>(0);
  readonly magneticHeading = signal<number>(0);
  readonly useTrueNorth = signal<boolean>(false);
  readonly magneticDeclination = signal<number>(3.5);
  readonly accuracy = signal<number | null>(null);
  readonly isSimulated = signal<boolean>(false);
  readonly hasPermission = signal<boolean | null>(null);
  readonly hasHardwareSensor = signal<boolean>(false);

  readonly heading = computed(() => {
    let base = this.magneticHeading();
    if (this.useTrueNorth()) {
      base = normalizeAngle(base + this.magneticDeclination());
    }
    return Math.round(base * 10) / 10;
  });

  private listener: ((e: DeviceOrientationEvent) => void) | null = null;
  private orientationChangeListener: (() => void) | null = null;
  private screenOrientationAngle = 0;

  constructor() {
    this.updateScreenOrientation();
    this.initCompassListener();
    this.initOrientationChangeListener();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  toggleTrueNorth() {
    this.useTrueNorth.update((v) => !v);
  }

  setDeclination(deg: number) {
    this.magneticDeclination.set(deg);
  }

  toggleSimulation() {
    this.isSimulated.update((v) => !v);
  }

  setSimulatedHeading(deg: number) {
    if (!this.isSimulated()) {
      this.isSimulated.set(true);
    }
    const filtered = lowPassFilter(deg, this.magneticHeading(), 0.8);
    this.magneticHeading.set(filtered);
  }

  async requestPermission(): Promise<boolean> {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const state = await (DeviceOrientationEvent as any).requestPermission();
        const granted = state === 'granted';
        this.hasPermission.set(granted);
        if (granted) {
          this.initCompassListener();
        }
        return granted;
      } catch (err) {
        console.warn('[CompassService]: Permission error:', err);
        this.hasPermission.set(false);
        return false;
      }
    } else {
      this.hasPermission.set(true);
      return true;
    }
  }

  private initCompassListener() {
    if (typeof window === 'undefined') return;

    this.listener = (e: DeviceOrientationEvent) => {
      if (this.isSimulated()) return;

      let compassHeading: number | null = null;

      // 1. iOS Safari / WebKit native compass heading
      if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
        compassHeading = (e as any).webkitCompassHeading;
        if ((e as any).webkitCompassAccuracy !== undefined) {
          this.accuracy.set((e as any).webkitCompassAccuracy);
        }
        this.hasHardwareSensor.set(true);
      }
      // 2. Android Chrome / Firefox / Opera absolute or standard device orientation
      else if (e.alpha !== null && e.alpha !== undefined) {
        if ((e as any).absolute === true || e.alpha !== null) {
          compassHeading = 360 - e.alpha;
          this.hasHardwareSensor.set(true);
        }
      }

      if (compassHeading !== null) {
        const adjustedHeading = normalizeAngle(compassHeading + this.screenOrientationAngle);
        const prev = this.magneticHeading();
        const smoothed = lowPassFilter(adjustedHeading, prev, 0.3);

        this.magneticHeading.set(smoothed);
        this.rawHeading.set(adjustedHeading);
      }
    };

    const win = window as any;
    if ('ondeviceorientationabsolute' in win) {
      win.addEventListener('deviceorientationabsolute', this.listener, true);
    } else {
      win.addEventListener('deviceorientation', this.listener, true);
    }
  }

  private initOrientationChangeListener() {
    if (typeof window === 'undefined') return;

    this.orientationChangeListener = () => {
      this.updateScreenOrientation();
    };

    window.addEventListener('orientationchange', this.orientationChangeListener);
    if (screen.orientation) {
      screen.orientation.addEventListener('change', this.orientationChangeListener);
    }
  }

  private updateScreenOrientation() {
    if (typeof window === 'undefined') return;

    if (screen.orientation && typeof screen.orientation.angle === 'number') {
      this.screenOrientationAngle = screen.orientation.angle;
    } else if (typeof window.orientation === 'number') {
      this.screenOrientationAngle = window.orientation;
    } else {
      this.screenOrientationAngle = 0;
    }
  }

  private removeListeners() {
    if (typeof window === 'undefined') return;
    const win = window as any;

    if (this.listener) {
      win.removeEventListener('deviceorientationabsolute', this.listener, true);
      win.removeEventListener('deviceorientation', this.listener, true);
      this.listener = null;
    }

    if (this.orientationChangeListener) {
      window.removeEventListener('orientationchange', this.orientationChangeListener);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', this.orientationChangeListener);
      }
      this.orientationChangeListener = null;
    }
  }
}
