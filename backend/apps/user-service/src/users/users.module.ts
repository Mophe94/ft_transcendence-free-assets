import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserStats } from '../stats/stats.entity';
import { Account } from './entities/accounts.entity';
import { UserStatService } from '../stats/stats.services';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserStats, Account])],
  controllers: [UsersController],
  providers: [UsersService,
			  UserStatService,
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
