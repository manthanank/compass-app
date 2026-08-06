export interface CompassReading {
  heading: number;
  magneticHeading?: number;
  trueHeading?: number;
  accuracy?: number;
  isSimulated?: boolean;
}

export interface LocationReading {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  accuracy: number | null;
  timestamp: number | null;
}
