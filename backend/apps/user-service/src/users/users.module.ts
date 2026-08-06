import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserStats } from '../stats/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStats])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
