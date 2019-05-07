import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { RouterModule } from '@angular/router';
import { IsLoggedInDirective } from '../auth/is-logged-in.directive';

@NgModule({
  declarations: [NavComponent, IsLoggedInDirective],
  exports: [NavComponent, IsLoggedInDirective],
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class ShellModule { }
