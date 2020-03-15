import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoriesComponent } from './stories/stories.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StoriesComponent
  }
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  declarations: [StoriesComponent]
})
export class StoriesModule {}
