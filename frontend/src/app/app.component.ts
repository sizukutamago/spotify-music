import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public redirectUrl = `https://accounts.spotify.com/authorize?client_id=c48c47f5403e4409bcfe36f3c117d852&response_type=token&redirect_uri=https://spotify-play-music.herokuapp.com/player/callback&state=aaa&scope=streaming+user-read-email+user-modify-playback-state+user-read-private+user-read-playback-state&show_dialog=true`;
  constructor(public auth: AuthService, public route: Router) {}
}
