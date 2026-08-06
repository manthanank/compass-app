import { Injectable, signal } from '@angular/core';
import { WeatherData } from '../../models/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  readonly currentWeather = signal<WeatherData>({
    temperatureC: 28,
    condition: 'Partly Cloudy',
    windSpeedKmh: 14,
    windDirectionDeg: 215,
    sunrise: '06:14 AM',
    sunset: '06:52 PM',
    moonPhase: 'Waxing Gibbous (78%)',
    waveHeightMeters: 1.2,
    tideState: 'Rising',
    swellDirectionDeg: 230,
  });

  refreshWeather(lat?: number, lon?: number) {
    const randTemp = 24 + Math.round(Math.random() * 8);
    const randWind = 10 + Math.round(Math.random() * 15);
    const randWindDeg = Math.round(Math.random() * 360);
    const randWave = Math.round((0.8 + Math.random() * 1.5) * 10) / 10;

    this.currentWeather.set({
      temperatureC: randTemp,
      condition: ['Clear Sky', 'Partly Cloudy', 'Breezy Trails', 'Light Mist'][Math.floor(Math.random() * 4)],
      windSpeedKmh: randWind,
      windDirectionDeg: randWindDeg,
      sunrise: '06:12 AM',
      sunset: '06:54 PM',
      moonPhase: 'Waxing Gibbous (82%)',
      waveHeightMeters: randWave,
      tideState: Math.random() > 0.5 ? 'Rising' : 'Falling',
      swellDirectionDeg: (randWindDeg + 15) % 360,
    });
  }
}
