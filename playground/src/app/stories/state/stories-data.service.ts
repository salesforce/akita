import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoriesDataService {
  constructor() {}

  add(story) {
    return timer(1000).pipe(mapTo(story));
  }
}
