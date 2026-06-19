import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app)); // added to switch to ws instead of default socket.io

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', //when deployed with swarm replace by DNS name of the container
      port: 40001,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.GAME_SERVICE_PORT ?? 3000);
}
bootstrap();
