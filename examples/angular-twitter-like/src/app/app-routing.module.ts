import { NotificationsComponent } from './notifications/notifications.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TweetsComponent } from './tweets/tweets.component';

const routes: Routes = [
  { path: '', redirectTo: 'tweets', pathMatch: 'full' },
  { path: 'tweets', component: TweetsComponent },
  { path: 'notifications', component: NotificationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
