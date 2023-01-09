import { Injectable } from '@angular/core';
import { arrayRemove, ID, transaction, withTransaction } from '@datorama/akita';
import { mapTo, of, timer } from 'rxjs';
import { ActorsStore } from '../actors/state/actors.store';
import { GenresStore } from '../genres/state/genres.store';
import { movies } from '../normalized';
import { MoviesQuery } from './movies.query';
import { MoviesStore } from './movies.store';

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(private moviesStore: MoviesStore, private actorsStore: ActorsStore, private genresStore: GenresStore, private moviesQuery: MoviesQuery) {}

  getMovies() {
    const request$ = timer(1000).pipe(
      mapTo(movies),
      withTransaction((response) => {
        this.actorsStore.set(response.entities.actors);
        this.genresStore.set(response.entities.genres);
        const movies = {
          entities: response.entities.movies,
          ids: response.result,
        };
        this.moviesStore.set(movies);
      })
    );

    return this.moviesQuery.getHasCache() ? of() : request$;
  }

  updateActorName(id: ID, name: string) {
    this.actorsStore.update(id, { name });
  }

  markAsOpen(id: ID) {
    this.moviesStore.ui.update(id, (entity) => ({ isOpen: !entity.isOpen }));
  }

  @transaction()
  deleteActor(id: ID) {
    this.actorsStore.remove(id);
    this.moviesStore.update(null, (entity) => ({ actors: arrayRemove(entity.actors, id) }));
  }
}
