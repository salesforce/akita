import { Injectable } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { PostsStore } from './posts.store';

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private postStore: PostsStore) {}
}
