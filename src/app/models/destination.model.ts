export interface Destination {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  category?: 'home' | 'camp' | 'car' | 'viewpoint' | 'water' | 'custom';
  notes?: string;
  createdAt?: number;
}
