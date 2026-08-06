import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage';
import { NavigationService } from '../../../../core/services/navigation';
import { LocationService } from '../../../../core/services/location';
import { Destination } from '../../../../models/destination.model';
import { CardComponent } from '../../../../shared/components/card/card';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav';
import { IconComponent, IconName } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-places-management',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardComponent, HeaderComponent, BottomNavComponent, IconComponent],
  template: `
    <div class="page-container">
      <app-header />

      <app-card>
        <div class="places-header">
          <h2>
            <app-icon name="places" [size]="20" class="header-icon" />
            Saved Outdoor Waypoints
          </h2>
          <button class="add-btn" (click)="showForm = !showForm">
            {{ showForm ? 'Cancel' : '+ Save GPS Location' }}
          </button>
        </div>

        @if (showForm) {
          <div class="form-container">
            <h3>Save Current Position</h3>
            <div class="input-group">
              <label>Location / Waypoint Name</label>
              <input type="text" [(ngModel)]="newPlaceName" placeholder="e.g. Basecamp Alpha, Ridge Summit, Vehicle Parking" />
            </div>

            <div class="input-group">
              <label>Category</label>
              <select [(ngModel)]="newCategory">
                <option value="camp">⛺ Basecamp</option>
                <option value="home">🏠 Home Base</option>
                <option value="car">🚗 Vehicle Parking</option>
                <option value="viewpoint">🌄 Scenic Viewpoint</option>
                <option value="water">💧 Water Source</option>
              </select>
            </div>

            <button class="submit-btn" (click)="saveCurrentLocation()">
              Save Coordinates ({{ location.latitude()?.toFixed(4) }}, {{ location.longitude()?.toFixed(4) }})
            </button>
          </div>
        }

        <div class="search-box">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search waypoints by name..." />
        </div>

        <div class="places-list">
          @for (place of filteredPlaces(); track place.id) {
            <div 
              class="place-item"
              [class.active-target]="navigation.destination()?.id === place.id">
              
              <div class="place-icon-box">
                <app-icon [name]="getCategoryIcon(place.category)" [size]="20" />
              </div>

              <div class="place-details">
                <span class="place-name">{{ place.name }}</span>
                <span class="place-coords">{{ place.latitude.toFixed(4) }}°, {{ place.longitude.toFixed(4) }}°</span>
              </div>

              <div class="place-actions">
                <button 
                  class="target-btn" 
                  [class.selected]="navigation.destination()?.id === place.id"
                  (click)="selectTarget(place)">
                  {{ navigation.destination()?.id === place.id ? '🎯 Navigating' : 'Navigate' }}
                </button>

                <button class="delete-btn" (click)="deletePlace(place.id)" title="Delete waypoint">
                  <app-icon name="trash" [size]="16" />
                </button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              No saved waypoints found matching your search.
            </div>
          }
        </div>
      </app-card>

      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 800px;
      margin: auto;
      padding: 24px;
      padding-bottom: 100px;
    }

    .places-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .places-header h2 {
      font-size: 18px;
      font-weight: 800;
      margin: 0;
      color: var(--color-text-main, #fff);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon {
      color: var(--color-primary, #ef4444);
    }

    .add-btn {
      background: var(--color-primary, #ef4444);
      border: none;
      color: #fff;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .form-container {
      background: var(--color-input-bg, rgba(0, 0, 0, 0.3));
      padding: 16px;
      border-radius: 16px;
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-container h3 {
      font-size: 14px;
      margin: 0;
      color: var(--color-text-main, #fff);
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .input-group label {
      font-size: 11px;
      color: var(--color-text-muted, #9ca3af);
    }

    .input-group input, .input-group select {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-main, #fff);
      padding: 10px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 13px;
    }

    .submit-btn {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #10b981;
      padding: 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .search-box input {
      width: 100%;
      background: var(--color-input-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
      color: var(--color-text-main, #fff);
      padding: 12px;
      border-radius: 14px;
      font-family: inherit;
      margin-bottom: 16px;
      box-sizing: border-box;
    }

    .places-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .place-item {
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--color-input-bg, rgba(255, 255, 255, 0.03));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
      padding: 12px 16px;
      border-radius: 16px;
      transition: all 0.2s ease;
    }

    .place-item.active-target {
      border-color: rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.06);
    }

    .place-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--color-primary, #ef4444);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .place-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .place-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--color-text-main, #fff);
    }

    .place-coords {
      font-size: 11px;
      color: var(--color-text-muted, #9ca3af);
      font-family: monospace;
    }

    .place-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .target-btn {
      background: var(--color-input-bg, rgba(255, 255, 255, 0.06));
      border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
      color: var(--color-text-main, #d1d5db);
      padding: 6px 14px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }

    .target-btn.selected {
      background: var(--color-primary, #ef4444);
      border-color: var(--color-primary, #ef4444);
      color: #fff;
    }

    .delete-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-muted, #9ca3af);
      display: grid;
      place-items: center;
      padding: 6px;
      border-radius: 8px;
      transition: color 0.2s ease;
    }

    .delete-btn:hover {
      color: #ef4444;
    }

    .empty-state {
      text-align: center;
      color: var(--color-text-muted, #9ca3af);
      padding: 24px;
      font-size: 13px;
    }
  `]
})
export class PlacesManagementComponent {
  protected readonly storage = inject(StorageService);
  protected readonly navigation = inject(NavigationService);
  protected readonly location = inject(LocationService);

  showForm = false;
  searchQuery = '';
  newPlaceName = '';
  newCategory: 'home' | 'camp' | 'car' | 'viewpoint' | 'water' | 'custom' = 'camp';

  filteredPlaces(): Destination[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.storage.savedPlaces();
    return this.storage.savedPlaces().filter(
      (p) => p.name.toLowerCase().includes(q) || p.notes?.toLowerCase().includes(q)
    );
  }

  saveCurrentLocation() {
    if (!this.newPlaceName) return;
    const lat = this.location.latitude() || 15.4920;
    const lon = this.location.longitude() || 73.8278;

    const created = this.storage.addPlace({
      name: this.newPlaceName,
      latitude: lat,
      longitude: lon,
      category: this.newCategory,
    });

    this.navigation.setDestination(created);
    this.newPlaceName = '';
    this.showForm = false;
  }

  selectTarget(place: Destination) {
    this.navigation.setDestination(place);
  }

  deletePlace(id: string) {
    this.storage.removePlace(id);
    if (this.navigation.destination()?.id === id) {
      this.navigation.clearDestination();
    }
  }

  getCategoryIcon(cat?: string): IconName {
    switch (cat) {
      case 'home': return 'places';
      case 'camp': return 'hiking';
      case 'car': return 'motorcycle';
      case 'viewpoint': return 'mountain';
      case 'water': return 'anchor';
      default: return 'target';
    }
  }
}
