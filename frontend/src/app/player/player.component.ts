import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

declare global {
  interface window {
    onSpotifyWebPlaybackSDKReady: () => void;
    spotifyReady: Promise<void>;
  }
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private player: Spotify.Player;
  private deviceId: string | undefined;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private state: Spotify.PlaybackState;

  constructor(
    private router: ActivatedRoute,
    private http: HttpClient,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.router.url.subscribe(() => {
      const queries = this.router.snapshot.fragment?.split('=');
      if (!queries?.includes('access_token')) {
        return;
      }

      // const code = this.router.snapshot.fragment?.split('=')[1] as string;
      const accessToken = '';
      this.auth.login(accessToken);
      this.addSpotifyPlaybackSdk();

      // this.getAccessToken(
      //   this.router.snapshot.fragment?.split('=')[1] as string,
      // );
    });
  }

  // getAccessToken(code: string) {
  //   this.http
  //     .post<{ access_token: string }>('http://localhost:3000/spotify', { code })
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.auth.login(response.access_token);
  //     });
  // }

  addSpotifyPlaybackSdk() {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // console.log(window.Spotify.Player);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.player = new Spotify.Player({
        name: 'music',
        volume: 0.01,
        getOAuthToken: (cd: (arg0: string | null) => void) => {
          cd(localStorage.getItem('access_token'));
        },
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.player.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.player.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.player.addListener('account_error', ({ message }) => {
        console.error(message);
      });

      // Ready
      this.player.addListener('ready', (data: any) => {
        console.log('Ready with Device ID', data.device_id);
        this.deviceId = data.device_id;
      });

      this.player.connect().then((res: any) => {
        console.log({ res });
      });

      this.player.addListener('player_state_changed', (state: any) => {
        console.log({ state });
        if (
          this.state &&
          state.track_window.previous_tracks.find(
            (x: any) => x.id === state.track_window.current_track.id,
          ) &&
          !this.state.paused &&
          state.paused
        ) {
          console.log('Track ended');
        }
        this.state = state;
      });
    };
  }

  play() {
    console.log(this.player.togglePlay());

    this.player.getCurrentState().then((state: any) => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }

      const current_track = state.track_window.current_track;
      const next_track = state.track_window.next_tracks[0];

      console.log('Currently Playing', current_track);
      console.log('Playing Next', next_track);
    });

    this.search();
  }

  search() {
    this.http
      .get(
        'https://api.spotify.com/v1/search?type=album&include_external=audio&q=peko&market=JP',
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.auth.getAccessToken(),
          }),
        },
      )
      .subscribe((response) => {
        console.log(response);
        this.add();
      });
  }

  add() {
    this.http
      .put(
        'https://api.spotify.com/v1/me/player/play?device_id=' + this.deviceId,
        {
          deviceId: this.deviceId,
          context_uri: 'spotify:album:5bYaxMZZzDx6bTQajJJ0Mn',
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.auth.getAccessToken(),
          }),
        },
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
