import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies/movies.component';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { MovieEffects } from './state/movie.effects';

const routes: Routes = [
  {
    path: '',
    component: MoviesComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), AkitaNgEffectsModule.forFeature([MovieEffects])],
  declarations: [MoviesComponent],
})
export class MoviesModule {}
