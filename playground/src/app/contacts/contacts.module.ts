import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsPageComponent } from './contacts-page/contacts-page.component';
import { RouterModule, Routes } from '@angular/router';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { contactsPaginatorProvider } from './state/contacts.pagination';

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
