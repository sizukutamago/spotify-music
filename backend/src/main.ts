import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as fs from 'fs';
import * as spdy from 'spdy';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const expressApp = express();
  const spdyOpts = {
    key: fs.readFileSync('./src/test.key'),
    cert: fs.readFileSync('./src/test.crt'),
  };
  const server = spdy.createServer(spdyOpts, expressApp);
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.enableCors();
  await app.init();
  await server.listen(3000);
}
bootstrap();
