import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrackService } from './core/services/track';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly trackService = inject(TrackService);

  ngOnInit(): void {
    this.trackService.trackProjectVisit('compass-app').subscribe();
  }
}
