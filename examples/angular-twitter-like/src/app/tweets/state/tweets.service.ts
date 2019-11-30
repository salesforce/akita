import { Injectable } from '@angular/core';
import { TweetsStore } from './tweets.store';
import { getTweets, newTweets } from '../tweets.data';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TweetsService {
  constructor(private tweetsStore: TweetsStore) { }

  get(page: number) {
    this.tweetsStore.setLoading(true);
    return getTweets({ page }).pipe(tap(res => this.updateTweets(res)));
  }

  pollNewTweets() {
    return newTweets().pipe(
      tap(tweets => {
        this.tweetsStore.add(tweets, { prepend: true });
        this.tweetsStore.update(state => ({
          unseenTweets: {
            ...state.unseenTweets,
            ...tweets.reduce((acc, t) => {
              acc[t.id] = true;
              return acc;
            }, {})
          }
        }))
      }),
    );
  }

  resetNewTweets() {
    this.tweetsStore.update({ unseenTweets: {} });
  }

  private updateTweets(response) {
    const nextPage = response.currentPage + 1;
    this.tweetsStore.add(response.data);
    this.tweetsStore.update({ hasMore: response.hasMore, page: nextPage });
    this.tweetsStore.setLoading(false);
  }
}
