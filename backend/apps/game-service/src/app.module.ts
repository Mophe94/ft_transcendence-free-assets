import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LobbyModule } from './lobby/lobby.module';
import { GameModule } from './game/game.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_GAME_HOST') ?? 'localhost',
        port: configService.get<number>('DB_GAME_PORT') ?? 5432,
        username: configService.get<string>('DB_GAME_USERNAME'),
        password: configService.get<string>('DB_GAME_PASSWORD'),
        database: configService.get<string>('DB_GAME_NAME') ?? 'test',
        synchronize: true, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Only for dev, remove for prod.
        autoLoadEntities: true,
      }),
    }), // switch for GAME DB
    LobbyModule,
    GameModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
