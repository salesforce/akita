import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsManagerComponent } from './forms-manager/forms-manager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FormsManagerComponent
  }
];

@NgModule({
  declarations: [FormsManagerComponent],
  imports: [ReactiveFormsModule, CommonModule, RouterModule.forChild(routes)]
})
export class FormsManagerModule {}
