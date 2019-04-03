import { Injectable } from '@angular/core';
import { StoriesStore } from './stories.store';
import { mapTo, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoriesService {
  constructor(private storiesStore: StoriesStore) {}

  add(story) {
    this.storiesStore.setLoading(true);
    return timer(1000)
      .pipe(mapTo(story))
      .pipe(
        tap(story => {
          this.storiesStore.setLoading(false);
          this.storiesStore.add(story);
        })
      );
  }
}
