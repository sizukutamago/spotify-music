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
    {
      name: string;
      uri: string;
      album: { images: { url: string }[]; uri: string };
    },
  ] = [];

  public playMusic = false;

  public volume = 50;

  private position_ms = 0;

  public playing = false;

  private playingUrl = '';

  private audioContext = new AudioContext();

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

      this.player.connect().then((connect: any) => {
        console.log({ connect });
      });
    };

    window.onload = () => {
      this.audioContext.resume();
    };
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.auth.getAccessToken(),
    });
  }

  put(url: string, body: object) {
    return this.http.put(url, body, {
      headers: this.getHeaders(),
    });
  }

  post(url: string, body: object) {
    return this.http.post(url, body, {
      headers: this.getHeaders(),
    });
  }

  get(url: string) {
    return this.http.get(url, {
      headers: this.getHeaders(),
    });
  }

  queue(uri: string) {
    this.post(
      `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
      {},
    ).subscribe(() => {
      this.get(`https://api.spotify.com/v1/me/player?market=JP`).subscribe();
    });
  }

  search() {
    this.get(
      `https://api.spotify.com/v1/search?type=track&include_external=audio&q=${this.searchText}&market=JP`,
    ).subscribe((response: any) => {
      this.searchItems = response.tracks.items;
    });
  }

  pause() {
    if (this.playing) {
      this.put(
        `https://api.spotify.com/v1/me/player/pause?device_id=${this.deviceId}`,
        {},
      ).subscribe(() => {
        this.playing = false;
      });

      this.get(`https://api.spotify.com/v1/me/player?market=JP`).subscribe(
        (res: any) => {
          this.position_ms = res.progress_ms;
        },
      );
    } else {
      this.play(this.playingUrl, this.position_ms);
      this.playing = true;
    }
  }

  playlists() {
    this.get(`https://api.spotify.com/v1/me/playlists`).subscribe();
  }

  play(uri: string, positionMs = 0) {
    this.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`,
      {
        context_uri: uri,
        position_ms: positionMs,
      },
    ).subscribe(() => {
      this.playMusic = true;
      this.playing = true;
      this.playingUrl = uri;
    });
  }

  changeVolume() {
    this.put(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${this.volume}&device_id=${this.deviceId}`,
      { volume_percent: this.volume, device_id: this.deviceId },
    ).subscribe();
  }
}
