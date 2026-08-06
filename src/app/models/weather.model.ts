export interface WeatherData {
  temperatureC: number;
  condition: string;
  windSpeedKmh: number;
  windDirectionDeg: number;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  waveHeightMeters?: number;
  tideState?: 'High' | 'Low' | 'Rising' | 'Falling';
  swellDirectionDeg?: number;
}
