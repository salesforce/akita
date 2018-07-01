import { Component, NgZone, OnInit } from '@angular/core';
import { akitaDevtools } from '../../../akita/src/plugins/devtools';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {
    if (!environment.production) {
      akitaDevtools(ngZone);
    }
  }

  ngOnInit() {}
}
