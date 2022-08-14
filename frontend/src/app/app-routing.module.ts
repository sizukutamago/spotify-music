import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { AuthGuard } from './guard/auth.guard';
import { CallbackComponent } from './callback/callback.component';
import { TopComponent } from './top/top.component';

const routes: Routes = [
  { path: '', component: TopComponent },
  { path: 'player', component: PlayerComponent, canActivate: [AuthGuard] },
  { path: 'player/callback', component: CallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
