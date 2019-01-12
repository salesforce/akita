import { Injectable } from '@angular/core';
import { MoviesStore, State } from './movies.store';
import { Movie } from './movie.model';
import { ID, QueryEntity } from '@datorama/akita';
import { ActorsQuery } from '../actors/state';
import { GenresQuery } from '../genres/state';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MoviesQuery extends QueryEntity<State, Movie> {
  constructor(protected store: MoviesStore, private actorsQuery: ActorsQuery, private genresQuery: GenresQuery) {
    super(store);
  }

  selectMovies() {
    return combineLatest(this.selectAll(), this.actorsQuery.selectAll({ asObject: true }), this.genresQuery.selectAll({ asObject: true })).pipe(
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
