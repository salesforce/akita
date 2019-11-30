import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FullMovie } from '../state/movie.model';
import { ID } from '@datorama/akita';
import { MoviesQuery } from '../state/movies.query';
import { MoviesService } from '../state/movies.service';
import { ActorsQuery } from '../actors/state/actors.query';
import { Actor } from '../actors/state/actor.model';
import { memo } from 'helpful-decorators';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies$: Observable<FullMovie[]>;
  actors$: Observable<Actor[]>;
  isLoading$: Observable<boolean>;
  private edits = new Set();

  constructor(private moviesQuery: MoviesQuery, private actorsQuery: ActorsQuery, private moviesService: MoviesService) {}

  ngOnInit() {
    this.isLoading$ = this.moviesQuery.selectLoading();

    this.movies$ = this.moviesQuery.selectMovies();
    this.actors$ = this.actorsQuery.selectAll();
    this.moviesService.getMovies().subscribe();
  }

  edit(id: ID, name: string) {
    this.moviesService.updateActorName(id, name);
    this.edits.delete(id);
  }

  toggleView(id: ID, actorName: HTMLInputElement) {
    if (this.edits.has(id)) {
      this.edits.delete(id);
    } else {
      this.edits.add(id);
      actorName.focus();
    }
  }

  inEditMode(id: ID) {
    return this.edits.has(id);
  }

  @memo()
  isOpen(id: ID) {
    return this.moviesQuery.ui.selectEntity(id, 'isOpen');
  }

  markAsOpen(id: ID) {
    this.moviesService.markAsOpen(id);
  }

  deleteActor(actor: Actor) {
    this.moviesService.deleteActor(actor.id);
  }
}
