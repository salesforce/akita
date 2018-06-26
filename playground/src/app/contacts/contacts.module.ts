import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@datorama/playground/node_modules/@angular/forms';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { contactsPaginatorProvider } from '@datorama/playground/src/app/contacts/state/contacts.pagination';

const routes: Routes = [
  {
    path: '',
    component: ContactsPageComponent
  }
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ContentLoaderModule, RouterModule.forChild(routes)],
  providers: [contactsPaginatorProvider],
  declarations: [ContactsPageComponent]
})
export class ContactsModule {}
