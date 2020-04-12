import { Component } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(r: RouterQuery) {
    // r.select().subscribe(console.log);
  }
}
