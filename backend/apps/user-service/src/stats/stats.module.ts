import { Module } from '@nestjs/common';
import { UserStatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatService } from '../stats/stats.services';
import { UserStats } from './stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserStats])],
  providers: [UserStatService],
  controllers: [UserStatsController],
  exports: [
    TypeOrmModule, UserStatService
  ],
})
export class UserStatsModule {}
