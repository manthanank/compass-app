import { Injectable, signal } from '@angular/core';
import { Destination } from '../../models/destination.model';

const STORAGE_KEY_PLACES = 'compass_app_saved_places';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly savedPlaces = signal<Destination[]>([]);

  constructor() {
    this.loadSavedPlaces();
  }

  private loadSavedPlaces() {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PLACES);
      if (data) {
        this.savedPlaces.set(JSON.parse(data));
      } else {
        const defaultPlaces: Destination[] = [
          {
            id: '1',
            name: 'Basecamp / Home',
            latitude: 15.4920,
            longitude: 73.8278,
            category: 'home',
            notes: 'Primary staging location',
            createdAt: Date.now(),
          },
          {
            id: '2',
            name: 'Scenic Viewpoint Ridge',
            latitude: 15.5150,
            longitude: 73.8420,
            category: 'viewpoint',
            notes: 'Panoramic mountain and ocean sunset view',
            createdAt: Date.now() - 86400000,
          },
          {
            id: '3',
            name: 'Motorcycle Park & Trailhead',
            latitude: 15.4780,
            longitude: 73.8150,
            category: 'car',
            notes: 'Off-road ride meeting spot',
            createdAt: Date.now() - 172800000,
          },
        ];
        this.savedPlaces.set(defaultPlaces);
        this.savePlacesToStorage(defaultPlaces);
      }
    } catch (e) {
      console.error('Failed to load places from storage', e);
    }
  }

  addPlace(place: Omit<Destination, 'id' | 'createdAt'>): Destination {
    const newPlace: Destination = {
      ...place,
      id: 'place_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      createdAt: Date.now(),
    };

    const updated = [newPlace, ...this.savedPlaces()];
    this.savedPlaces.set(updated);
    this.savePlacesToStorage(updated);
    return newPlace;
  }

  removePlace(id: string) {
    const updated = this.savedPlaces().filter((p) => p.id !== id);
    this.savedPlaces.set(updated);
    this.savePlacesToStorage(updated);
  }

  private savePlacesToStorage(places: Destination[]) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(places));
    } catch (e) {
      console.error('Failed to save places to storage', e);
    }
  }
}
