import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as _pages from 'src/app/pages';


const routes: Routes = [
  { path: '', component: _pages.SplashComponent },
  {
    path: 'app', component: _pages.LayoutComponent, children: [
      { path: '', component: _pages.SeasonsComponent },
      { path: ':seasonId/detail', component: _pages.SeasonDetailsComponent },
      { path: ':seasonId/episods', component: _pages.EpisodesComponent },
      { path: ':seasonId/episods/:episodeId', component: _pages.QuotesComponent }
    ]
  },
  {
    path: 'leitner', component: _pages.LayoutComponent, children: [
      { path: '', component: _pages.LeitnerListComponent },
    ]
  },
  {
    path: 'about', component: _pages.LayoutComponent, children: [
      { path: '', component: _pages.AboutUsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }