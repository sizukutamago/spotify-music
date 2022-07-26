import { Module } from '@nestjs/common';
import { SpotifyController } from './spotify.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SpotifyController],
})
export class SpotifyModule {}
