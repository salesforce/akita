import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetsComponent } from './tweets.component';
import { TweetComponent } from './tweet/tweet.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, InfiniteScrollModule, RouterModule],
  declarations: [TweetsComponent, TweetComponent]
})
export class TweetsModule {}
