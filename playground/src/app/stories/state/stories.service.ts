import { Injectable } from '@angular/core';
import { StoriesStore } from './stories.store';
import { StoriesDataService } from './stories-data.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  constructor(private storiesStore: StoriesStore, private storiesDataService: StoriesDataService) {}

  add(story) {
    this.storiesStore.setLoading(true);
    return this.storiesDataService.add(story).pipe(
      tap(entity => {
        this.storiesStore.setLoading(false);
        // this.storiesStore.add(entity);
      })
    );
  }
}
