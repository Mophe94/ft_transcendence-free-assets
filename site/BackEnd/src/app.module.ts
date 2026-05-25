import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { Settings } from './settings/settings.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: configService.get<number>('DB_PORT') ?? 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME') ?? 'test',
        entities: [User, Settings],
        synchronize: true, // !!Only for dev, remove for prod.
      }),
    }),
    UsersModule,
    AuthModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
