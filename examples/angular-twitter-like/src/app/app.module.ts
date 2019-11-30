import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TweetsModule } from './tweets/tweets.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [BrowserModule, AppRoutingModule, TweetsModule,  AkitaNgDevtools.forRoot()],
  bootstrap: [AppComponent]
})
export class AppModule {}
