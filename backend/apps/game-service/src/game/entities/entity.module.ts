import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonstersService } from './monsters.service';
import { Monster } from './monsters.entity';
import { Skill } from './skills.entity';

@Module({
  providers: [MonstersService],
  imports: [TypeOrmModule.forFeature([Monster, Skill])],
  exports: [MonstersService],
})
export class EntityModule {}
