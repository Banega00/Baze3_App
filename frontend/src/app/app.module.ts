import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModuleModule } from './angular-material-module/angular-material-module.module';
import { LayoutModule } from '@angular/cdk/layout';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/routing.module';
import { KlijentiPageComponent } from './pages/klijenti-page/klijenti-page.component';
import { VozilaPageComponent } from './pages/vozila-page/vozila-page.component';
import { ModeliTabComponent } from './pages/vozila-page/modeli-tab/modeli-tab.component';
import { VozilaTabComponent } from './pages/vozila-page/vozila-tab/vozila-tab.component';
import { ServisneKnjigeTabComponent } from './pages/vozila-page/servisne-knjige-tab/servisne-knjige-tab.component';
import { HttpClientModule } from '@angular/common/http';
import { KlijentiTabComponent } from './pages/klijenti-page/klijenti-tab/klijenti-tab.component';
import { KlijentComponent } from './pages/klijenti-page/klijenti-tab/klijent/klijent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VlasnistvaTabComponent } from './pages/klijenti-page/vlasnistva-tab/vlasnistva-tab.component';
import { UlicePageComponent } from './pages/ulice-page/ulice-page.component';
import { IzvestajiPageComponent } from './pages/izvestaji-page/izvestaji-page.component';
import { RadniNaloziComponent } from './pages/radni-nalozi/radni-nalozi.component';
import { PonudePageComponent } from './pages/ponude-page/ponude-page.component';
import { RadniciPageComponent } from './pages/radnici-page/radnici-page.component';
import { RadnikComponent } from './pages/radnici-page/radnik/radnik.component';
import { RacuniComponent } from './pages/racuni/racuni.component';
import { StavkaRacunaComponent } from './pages/racuni/stavka-racuna/stavka-racuna.component';
import { ProizvodiPageComponent } from './pages/proizvodi-page/proizvodi-page.component';

@NgModule({
  declarations: [
    AppComponent,
    KlijentiPageComponent,
    VozilaPageComponent,
    ModeliTabComponent,
    VozilaTabComponent,
    ServisneKnjigeTabComponent,
    KlijentiTabComponent,
    KlijentComponent,
    VlasnistvaTabComponent,
    UlicePageComponent,
    IzvestajiPageComponent,
    RadniNaloziComponent,
    PonudePageComponent,
    RadniciPageComponent,
    RadnikComponent,
    RacuniComponent,
    StavkaRacunaComponent,
    ProizvodiPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AngularMaterialModuleModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
