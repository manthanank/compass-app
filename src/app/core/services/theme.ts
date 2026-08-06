import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'apex_compass_theme_dark';
  readonly dark = signal<boolean>(true);

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved !== null) {
      this.dark.set(saved === 'true');
    }
    this.applyTheme();
  }

  toggle() {
    this.dark.update((v) => !v);
    localStorage.setItem(this.STORAGE_KEY, String(this.dark()));
    this.applyTheme();
  }

  private applyTheme() {
    if (this.dark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
