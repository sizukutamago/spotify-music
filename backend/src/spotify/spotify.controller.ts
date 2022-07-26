import { Body, Controller, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { btoa } from 'buffer';
import { map } from 'rxjs';

@Controller('spotify')
export class SpotifyController {
  constructor(private httpService: HttpService) {}

  @Post()
  async auth(@Body() request) {
    const params = new URLSearchParams();

    params.append('grant_type', 'client_credentials');
    params.append('code', request.code);
    params.append('redirect_uri', 'http://localhost:4200/player/callback');

    return this.httpService
      .post('https://accounts.spotify.com/api/token', params, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            btoa(
              process.env.SPOTIFY_CLIENT_ID +
                ':' +
                process.env.SPOTIFY_CLIENT_SECRET,
            ),
        },
      })
      .pipe(map((response) => response.data));
  }
}
