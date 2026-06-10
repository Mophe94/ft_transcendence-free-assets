import { NestFactory } from '@nestjs/core';
import { ChatServiceModule } from './chat-service.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(ChatServiceModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(process.env.CHAT_SERVICE_PORT ?? 3001);
}
void bootstrap();
