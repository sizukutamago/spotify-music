import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyModule } from './spotify/spotify.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), SpotifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
