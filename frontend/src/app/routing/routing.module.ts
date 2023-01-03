import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KlijentiPageComponent } from '../pages/klijenti-page/klijenti-page.component';
import { VozilaPageComponent } from '../pages/vozila-page/vozila-page.component';

// import { Page2Component } from './page2/page2.component';
// import { Page3Component } from './page3/page3.component';

const routes: Routes = [
  { path: 'klijenti', component: KlijentiPageComponent },
  { path: 'vozila', component: VozilaPageComponent },
  // { path: 'page3', component: Page3Component },
  { path: '', redirectTo: '/page1', pathMatch: 'full' },
  { path: '**', redirectTo: '/page1', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
