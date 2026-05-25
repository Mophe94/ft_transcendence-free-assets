import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { Settings } from './settings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  controllers: [SettingsController],
  exports: [TypeOrmModule],
})
export class SettingsModule {}
