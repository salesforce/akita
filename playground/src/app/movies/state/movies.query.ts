import { Injectable } from '@angular/core';
import { MoviesState, MoviesStore, MoviesUIState, MovieUI } from './movies.store';
import { Movie } from './movie.model';
import { EntityUIQuery, ID, QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActorsQuery } from '../actors/state/actors.query';
import { GenresQuery } from '../genres/state/genres.query';
import { waitForTransaction } from '../../../../../akita/src/transaction';

@Injectable({
  providedIn: 'root'
})
export class MoviesQuery extends QueryEntity<MoviesState, Movie> {
  ui: EntityUIQuery<MoviesUIState, MovieUI>;

  constructor(protected store: MoviesStore, private actorsQuery: ActorsQuery, private genresQuery: GenresQuery) {
    super(store);
    this.createUIQuery();
  }

  selectMovies() {
    return combineLatest(this.selectAll(), this.actorsQuery.selectAll({ asObject: true }), this.genresQuery.selectAll({ asObject: true })).pipe(
      waitForTransaction(),
      map(([movies, actors, genres]) => {
        return movies.map(movie => {
          return {
            ...movie,
            actors: movie.actors.map(actorId => actors[actorId as ID]),
            genres: movie.genres.map(genreId => genres[genreId as ID])
          };
        });
      })
    );
  }
}
