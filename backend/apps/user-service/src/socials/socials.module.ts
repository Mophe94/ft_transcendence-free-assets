import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialsController } from './social.controller';
import { SocialService } from './socials.service';
import { UsersModule } from '../users/users.module';
import { Relationship } from './entities/relationships.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Relationship]), UsersModule],
  controllers: [SocialsController],
  providers: [SocialService],
})
export class SocialsModule {}
