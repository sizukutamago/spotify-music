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

  public searchText = '';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public searchItems: [{ name: string; uri: string }] = [];

  constructor(
    private router: ActivatedRoute,
    private http: HttpClient,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.router.url.subscribe(() => {
      const queries = this.router.snapshot.fragment?.split('&');

      const accessTokenQuery = queries?.find((query) => {
        return query.indexOf('access_token') !== -1;
      });

      if (!accessTokenQuery) {
        return;
      }

      const accessTokenParam = accessTokenQuery.split('=');
      const accessToken = accessTokenParam[1];
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

      // Ready
      this.player.addListener('ready', (data: any) => {
        console.log('Ready with Device ID', data.device_id);
        this.deviceId = data.device_id;
      });

      this.player.connect().then((res: any) => {
        console.log({ res });
      });
    };
  }

  search() {
    this.http
      .get(
        `https://api.spotify.com/v1/search?type=album&include_external=audio&q=${this.searchText}&market=JP`,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.auth.getAccessToken(),
          }),
        },
      )
      .subscribe((response: any) => {
        this.searchItems = response.albums.items;
      });
  }

  play(uri: string) {
    this.http
      .put(
        'https://api.spotify.com/v1/me/player/play?device_id=' + this.deviceId,
        {
          deviceId: this.deviceId,
          context_uri: uri,
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
