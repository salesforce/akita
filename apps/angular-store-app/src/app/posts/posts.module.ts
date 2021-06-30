import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts.component';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { PostEffects } from './state/post.effects';

const routes: Routes = [
  {
    path: '',
    component: PostsComponent,
  },
];

@NgModule({
  declarations: [PostsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), AkitaNgEffectsModule.forFeature([PostEffects])],
})
export class PostsModule {}
