import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { AuthStore } from './auth.store';
import { AuthDataService } from './auth-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private authStore: AuthStore, private authDataService: AuthDataService) {}

  get() {
    // this.authDataService.get().subscribe((entities: ServerResponse) => {
    // this.authStore.set(entities);
    // });
  }

  add() {
    // this.authDataService.post().subscribe((entity: ServerResponse) => {
    // this.authStore.add(entity);
    // });
  }
}
