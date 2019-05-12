import { Injectable } from '@angular/core';
import { ID, QueryEntity } from '@datorama/akita';
import { TweetsStore, TweetsState } from './tweets.store';
import { Tweet } from './tweet.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TweetsQuery extends QueryEntity<TweetsState, Tweet> {
  selectNewTweetsCount$= this.select('unseenTweets').pipe(
    map(tweets => Object.keys(tweets).length)
  );

  constructor(protected store: TweetsStore) {
    super(store);
  }

  hasMore() {
    return this.getValue().hasMore;
  }

  getNextPage() {
    return this.getValue().page;
  }

  isUnseenTweet(id: ID) {
    return this.getValue().unseenTweets.hasOwnProperty(id);
  }
}
