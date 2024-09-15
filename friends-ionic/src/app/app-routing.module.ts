import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import * as pages from './pages';

const routes: Routes = [
  {
    path: '',
    component: pages.SplashPage
  },
  {
    path: 'app',
    component: pages.MasterLayout,
    children: [
      { path: '', redirectTo: 'seasons', pathMatch: 'full' },
      { path: 'seasons', component: pages.SeasonsPage },
      { path: ':seasonId/episods', component: pages.EpisodesPage },
      { path: ':seasonId/episods/:episodeId', component: pages.QuotesPage },
      { path: 'leitner', component: pages.LeitnerListPage },
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
