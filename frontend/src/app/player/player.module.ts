import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PlayerComponent],
  imports: [CommonModule, FormsModule],
})
export class PlayerModule {}
