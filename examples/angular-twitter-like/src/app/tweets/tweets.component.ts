import { TweetsService } from './state/tweets.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TweetsQuery } from './state/tweets.query';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ID } from '@datorama/akita';

@Component({
  template: `
  <div class="container">
    
    <div infiniteScroll
         [infiniteScrollDistance]="0.1"
         [infiniteScrollThrottle]="50"
         (scrolled)="getMore()">
      
        <div class="alert alert-info pointer" (click)="resetNewTweets()" *ngIf="newTweetsCount$ | async as newTweetsCount">
          See {{newTweetsCount}} new Tweets
        </div>
      
        <app-tweet *ngFor="let tweet of tweets$ | async" [tweet]="tweet" [class.hidden]="isUnseenTweet(tweet.id)"></app-tweet>
     </div>
    
     <div class="alert alert-dark" *ngIf="isLoading$ | async">
       Fetching tweets...
    </div>
    
  </div>
  `
})
export class TweetsComponent implements OnInit, OnDestroy {
  tweets$ = this.tweetsQuery.selectAll();
  isLoading$ = this.tweetsQuery.selectLoading();
  newTweetsCount$ = this.tweetsQuery.selectNewTweetsCount$;

  constructor(
    private tweetsQuery: TweetsQuery,
    private tweetsService: TweetsService
  ) { }

  ngOnInit() {
    this.fetchTweets();
    this.tweetsService.pollNewTweets().pipe(untilDestroyed(this)).subscribe({
      error() {
        // show error
      }
    });
  }

  getMore() {
    this.fetchTweets();
  }

  resetNewTweets() {
    this.tweetsService.resetNewTweets();
  }

  ngOnDestroy() {
  }

  private fetchTweets() {
    if (this.tweetsQuery.hasMore()) {
      this.tweetsService.get(this.tweetsQuery.getNextPage()).subscribe({
        error() {
          // show error
        }
      })
    }
  }

  isUnseenTweet(id: ID) {
    return this.tweetsQuery.isUnseenTweet(id);
  }
}
