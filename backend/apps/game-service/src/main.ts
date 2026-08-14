import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useWebSocketAdapter(new WsAdapter(app)); // added to switch to ws instead of default socket.io
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', //when deployed with swarm replace by DNS name of the container
      port: 40001,
    },
  });

  await app.startAllMicroservices();
  app.use(cookieParser());

  await app.listen(process.env.GAME_SERVICE_PORT ?? 3000);
}
bootstrap();
