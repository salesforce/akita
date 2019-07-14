import { Component, NgZone } from '@angular/core';
import { environment } from '../environments/environment';
import { persistState, akitaDevtools } from '@datorama/akita';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private ngZone: NgZone) {
    if (!environment.production) {
      akitaDevtools(ngZone);
    }
  }

  ngOnInit() {
    persistState({
      key: 'akitaPlayground',
      include: ['auth.token', 'todos'],
      // storage: localForage,
      preStorageUpdateOperator: () => debounceTime(1000),
      preStorageUpdate: function(storeName, state) {
        console.log(`preStorageUpdate`, storeName, state);
        return state;
      },
      preStoreUpdate(storeName: string, state: any) {
        console.log(`preStoreUpdate`, storeName, state);
        return state;
      }
    });
  }
}
