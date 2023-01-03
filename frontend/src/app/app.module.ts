import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModuleModule } from './angular-material-module/angular-material-module.module';
import { LayoutModule } from '@angular/cdk/layout';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/routing.module';
import { KlijentiPageComponent } from './pages/klijenti-page/klijenti-page.component';

@NgModule({
  declarations: [
    AppComponent,
    KlijentiPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AngularMaterialModuleModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
