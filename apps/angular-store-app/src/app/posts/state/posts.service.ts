import { Injectable } from '@angular/core';
import { PostsState, PostsStore } from './posts.store';
import { NgEntityService } from '@datorama/akita-ng-entity-service';

@Injectable({ providedIn: 'root' })
export class PostsService extends NgEntityService<PostsState> {
  constructor(protected store: PostsStore) {
    super(store);
  }
}
