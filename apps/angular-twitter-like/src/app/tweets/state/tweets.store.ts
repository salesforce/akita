import { Injectable } from '@angular/core';
import { EntityState, EntityStore, HashMap, StoreConfig } from '@datorama/akita';
import { Tweet } from './tweet.model';

export interface TweetsState extends EntityState<Tweet> {
  hasMore: boolean;
  page: number;
  unseenTweets: HashMap<boolean>;
}

const initialState: TweetsState = {
  hasMore: true,
  unseenTweets: {},
  page: 1
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tweets' })
export class TweetsStore extends EntityStore<TweetsState, Tweet> {
  constructor() {
    super(initialState);
  }
}
