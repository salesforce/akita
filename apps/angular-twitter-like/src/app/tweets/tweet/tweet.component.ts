import { Component, Input } from '@angular/core';
import { Tweet } from '../state/tweet.model';

@Component({
  selector: 'app-tweet',
  template: `
    <div class="card" *ngIf="tweet">
      <div class="card-body">
        <h5 class="card-title">{{ tweet.username }}</h5>
        <p class="card-text">{{ tweet.text }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent {
  @Input() tweet: Tweet;
}
