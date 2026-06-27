import { NestFactory } from '@nestjs/core';
import { ChatServiceModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(ChatServiceModule);
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new WsAdapter(app));
  const port = configService.get<number>('CHAT_SERVICE_PORT') || 3000;

  await app.listen(port);
}
void bootstrap();
