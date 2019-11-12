import { Component } from '@angular/core';
import { persistState } from '@datorama/akita';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ngOnInit() {
    persistState({
      key: 'akitaPlayground',
      include: ['auth.token', 'todos'],
      // storage: localForage,
      preStorageUpdateOperator: () => debounceTime(300),
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
