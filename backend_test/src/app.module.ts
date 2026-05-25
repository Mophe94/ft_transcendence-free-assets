import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway, GameService],
})
export class AppModule {}
