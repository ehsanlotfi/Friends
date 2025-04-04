import { NgModule, Component, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Router } from '@angular/router';
import { IonicModule, IonicRouteStrategy, ToastController } from '@ionic/angular';
import { App, URLOpenListenerEvent, URLOpenListener } from '@capacitor/app';
import { AppRoutingModule, HomeComponent } from './app-routing.module';
import { SQLiteService } from './services/sqlite.service';
import { InitializeAppService } from './services/initialize.app.service';
import * as pages from './pages';
import { SettingsService, GlobalService } from './services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export function initializeFactory(init: InitializeAppService)
{
  return () => init.initializeApp();
}

@Component({
  selector: 'app-root',
  template: `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`
})
export class AppComponent
{

  constructor(
    colorMode: SettingsService
  )
  {
    colorMode.darkMode$.subscribe((darkMode) =>
    {
      if (darkMode)
      {
        document.documentElement.classList.add('ion-palette-dark');
      } else
      {
        document.documentElement.classList.remove('ion-palette-dark');
      }
    })
  }

}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    pages.SplashPage,
    pages.MasterLayout,
    pages.SeasonsPage,
    pages.AboutUsPage,
    pages.EpisodesPage,
    pages.LeitnerListPage,
    pages.QuotesPage,
    pages.SettingsPage,
    pages.ContactUsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule],
  providers: [
    SQLiteService,
    GlobalService,
    SettingsService,
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
export class AppModule
{

  constructor(private _globalSvc: GlobalService)
  {
    let lastClickTime = 0;

    App.addListener('backButton', async ({ canGoBack }) =>
    {
      const currentTime = new Date().getTime();
      const timeSinceLastClick = currentTime - lastClickTime;

      if (timeSinceLastClick <= 1000)
      {
        App.exitApp();
      } else
      {
        await _globalSvc.toast("برای خروجی دوباره کلیک کنید");
      }

      lastClickTime = currentTime;
    });

  }

}
