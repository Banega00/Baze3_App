import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IzvestajiPageComponent } from '../pages/izvestaji-page/izvestaji-page.component';
import { KlijentiPageComponent } from '../pages/klijenti-page/klijenti-page.component';
import { PonudePageComponent } from '../pages/ponude-page/ponude-page.component';
import { RadniNaloziComponent } from '../pages/radni-nalozi/radni-nalozi.component';
import { UlicePageComponent } from '../pages/ulice-page/ulice-page.component';
import { VozilaPageComponent } from '../pages/vozila-page/vozila-page.component';

// import { Page2Component } from './page2/page2.component';
// import { Page3Component } from './page3/page3.component';

const routes: Routes = [
  { path: 'klijenti', component: KlijentiPageComponent },
  { path: 'vozila', component: VozilaPageComponent },
  { path: 'ulice', component: UlicePageComponent },
  { path: 'izvestaji', component: IzvestajiPageComponent },
  { path: 'radni-nalozi', component: RadniNaloziComponent },
  { path: 'ponude', component: PonudePageComponent },
  { path: '', redirectTo: '/klijenti', pathMatch: 'full' },
  { path: '**', redirectTo: '/klijenti', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
