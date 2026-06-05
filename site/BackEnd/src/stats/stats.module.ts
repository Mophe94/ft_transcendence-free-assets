import { Module } from '@nestjs/common';
import { UserStatsController } from './stats.controller';
import { TypeOrmModule } from 'node_modules/@nestjs/typeorm';
import { UserStats } from './stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStats])],
  controllers: [UserStatsController],
})
export class UserStatsModule {}
