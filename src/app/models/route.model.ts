export interface RoutePoint {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: number;
}

export interface TrackedRoute {
  id: string;
  name: string;
  startTime: number;
  endTime?: number;
  points: RoutePoint[];
  distanceMeters: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  elevationGainMeters: number;
  category: 'hiking' | 'motorcycle' | 'boating' | 'general';
}
