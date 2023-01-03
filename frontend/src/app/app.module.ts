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

@NgModule({
  declarations: [
    AppComponent,
    KlijentiPageComponent,
    VozilaPageComponent,
    ModeliTabComponent,
    VozilaTabComponent,
    ServisneKnjigeTabComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AngularMaterialModuleModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
