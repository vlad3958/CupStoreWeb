import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
@Component({
  imports: [RouterOutlet, LandingComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('CupStoreWeb');
}
