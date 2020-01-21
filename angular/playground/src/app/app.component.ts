import { Component } from '@angular/core';
import { persistState } from '@datorama/akita';
import { debounceTime } from 'rxjs/operators';
import * as localForage from 'localforage';

localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'Akita',
  version: 1.0,
  storeName: 'akita_playground'
});

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
        if (storeName == 'todos') {
          const { ui, ...stateWithoutUi } = state;
          return stateWithoutUi;
        }
        return state;
      },
      preStoreUpdate(storeName: string, state: any) {
        console.log(`preStoreUpdate`, storeName, state);
        return state;
      }
    });
  }
}
