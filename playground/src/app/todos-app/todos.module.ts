import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoComponent } from './todo/todo.component';
import { TodosComponent } from './todos/todos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TodosFiltersComponent } from './filter/todos-filters.component';
import { TodosPageComponent } from './todos-page/todos-page.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TodosPageComponent
  }
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [TodosComponent, TodosFiltersComponent],
  declarations: [TodoComponent, TodosComponent, TodosFiltersComponent, TodosPageComponent]
})
export class TodosModule {}
