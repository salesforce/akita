import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactsPageComponent } from './contacts/contacts-page/contacts-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { ContentLoaderModule } from '@netbasal/content-loader';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ContactsPageComponent, HomePageComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, ContentLoaderModule.forRoot(), environment.production ? [] : AkitaNgDevtools.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
