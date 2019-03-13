import { Injectable } from '@angular/core';
import { MoviesStore } from './movies.store';
import { ID } from '@datorama/akita';
import { timer } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { movies } from '../normalized';
import { ActorsStore } from '../actors/state/actors.store';
import { GenresStore } from '../genres/state/genres.store';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  constructor(private moviesStore: MoviesStore, private actorsStore: ActorsStore, private genresStore: GenresStore) {}

  getMovies() {
    return timer(1000).pipe(
      mapTo(movies),
      map(response => {
        this.actorsStore.set(response.entities.actors);
        this.genresStore.set(response.entities.genres);
        const movies = {
          entities: response.entities.movies,
          ids: response.result
        };
        return this.moviesStore.set(movies);
      })
    );
  }

  updateActorName(id: ID, name: string) {
    this.actorsStore.update(id, { name });
  }

  markAsOpen(id: ID) {
    this.moviesStore.ui.upsert(id, entity => ({ isOpen: !entity.isOpen }));
  }
}
