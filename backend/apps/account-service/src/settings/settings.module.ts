import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { Settings } from './settings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { AuthModule } from 'apps/account-service/src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Settings]), AuthModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [TypeOrmModule, SettingsService],
})
export class SettingsModule {}
