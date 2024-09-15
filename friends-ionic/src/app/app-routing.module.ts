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
      { path: '', component: pages.SeasonsPage }
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
