import { NgModule, Component } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import * as pages from './pages';
import { EntryGuard } from './services/entry-guard';
import { AppComponent } from './app.module';

@Component({
  selector: 'app-home',
  template: ``
})
export class HomeComponent
{
}

const routes: Routes = [
  {
    path: '',
    canActivate: [EntryGuard],
    component: HomeComponent
  },
  {
    path: 'splash',
    component: pages.SplashPage
  },
  {
    path: 'app',
    component: pages.MasterLayout,
    children: [
      { path: '', redirectTo: 'seasons', pathMatch: 'full' },
      { path: 'seasons', component: pages.SeasonsPage },
      { path: ':seasonId/episods', component: pages.EpisodesPage },
      { path: 'review', component: pages.QuotesPage },
      { path: 'review/:seasonId/episods/:episodeId', component: pages.QuotesPage },
      { path: 'leitner', component: pages.LeitnerListPage },
      { path: 'settings', component: pages.SettingsPage },
      { path: 'about', component: pages.AboutUsPage },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
