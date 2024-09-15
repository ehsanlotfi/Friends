import { NgModule, Component, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { SQLiteService } from './services/sqlite.service';
import { InitializeAppService } from './services/initialize.app.service';
import * as pages from './pages';
export function initializeFactory(init: InitializeAppService)
{
  return () => init.initializeApp();
}

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`
})
export class AppComponent { }

@NgModule({
  declarations: [
    AppComponent,
    pages.SplashPage,
    pages.MasterLayout,
    pages.SeasonsPage,
    pages.AboutUsPage,
    pages.EpisodesPage,
    pages.LeitnerListPage,
    pages.QuotesPage
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    SQLiteService,
    InitializeAppService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
