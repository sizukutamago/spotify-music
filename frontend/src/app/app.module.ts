import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PlayerModule } from './player/player.module';
import { CallbackComponent } from './callback/callback.component';
import { TopComponent } from './top/top.component';

@NgModule({
  declarations: [AppComponent, CallbackComponent, TopComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, PlayerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
