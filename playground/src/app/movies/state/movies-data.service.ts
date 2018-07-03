import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { movies } from '../normalized';

@Injectable({
  providedIn: 'root'
})
export class MoviesDataService {
  getMovies() {
    return timer(1000).pipe(mapTo(movies));
  }
}
