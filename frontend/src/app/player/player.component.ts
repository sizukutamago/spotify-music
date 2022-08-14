import { Component, OnInit } from '@angular/core';
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
  public searchItems: [
    { name: string; uri: string; images: { url: string }[] },
  ] = [];

  public playMusic = false;

  public volume = 50;

  private position_ms = 0;

  public playing = false;

  private playingUrl = '';

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.addSpotifyPlaybackSdk();
  }

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

  put(url: string, body: object) {
    return this.http.put(url, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.getAccessToken(),
      }),
    });
  }

  get(url: string) {
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.getAccessToken(),
      }),
    });
  }

  search() {
    this.get(
      `https://api.spotify.com/v1/search?type=album&include_external=audio&q=${this.searchText}&market=JP`,
    ).subscribe((response: any) => {
      console.log(response);
      this.searchItems = response.albums.items;
    });
  }

  pause() {
    if (this.playing) {
      this.put(
        `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
        {},
      ).subscribe((response) => {
        console.log('ss');
        this.playing = false;
      });

      this.get(`https://api.spotify.com/v1/me/player?market=JP`).subscribe(
        (res: any) => {
          this.position_ms = res.progress_ms;
        },
      );
    } else {
      this.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
        {
          position_ms: this.position_ms,
          context_uri: this.playingUrl,
        },
      ).subscribe((res) => {
        console.log('res');
      });
      this.playing = true;
    }
  }

  play(uri: string) {
    this.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
      {
        context_uri: uri,
      },
    ).subscribe((response) => {
      this.playMusic = true;
      this.playing = true;
      this.playingUrl = uri;
      console.log({ response });
    });
  }

  changeVolume() {
    this.put(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${this.volume}&device_id=${this.deviceId}`,
      { volume_percent: this.volume, device_id: this.deviceId },
    ).subscribe((res) => {
      console.log(res);
    });
  }
}
