import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app)); // added to switch to ws instead of default socket.io
  await app.listen(process.env.GAME_SERVICE_PORT ?? 3002);
}
bootstrap();
