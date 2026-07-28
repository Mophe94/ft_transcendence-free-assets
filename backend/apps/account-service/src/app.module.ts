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
import { UserStatsModule } from './stats/stats.module';
import { UserStats } from './stats/stats.entity';
import { getSecret } from 'app/shared/utils/secret.utils';
import { HealthModule } from 'libs/shared/src/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_USERS_HOST') ?? 'localhost',
        port: configService.get<number>('DB_USERS_PORT') ?? 5432,
        username: getSecret('db_users_username'),
        password: getSecret('db_users_password'),
        database: getSecret('db_users_db_name'),
        entities: [User, Settings, UserStats],
        synchronize: true, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Only for dev, remove for prod.
      }),
    }),
    UsersModule,
    AuthModule,
    SettingsModule,
    UserStatsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
