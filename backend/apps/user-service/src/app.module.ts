import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/users.entity';
import { getSecret } from '../../../libs/shared/src/utils/secret.utils';
import { Account } from './users/entities/accounts.entity';
import { Relationship } from './socials/entities/relationships.entity';
import { SettingsModule } from './settings/settings.module';
import { UserStats } from './stats/stats.entity';
import { AuthModule } from './auth/auth.module';
import { SocialsModule } from './socials/socials.module';

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
        entities: [User, Account, Relationship, UserStats],
        synchronize: true, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Only for dev, remove for prod.
      }),
    }),
    UsersModule,
    SettingsModule,
    AuthModule,
    SocialsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
