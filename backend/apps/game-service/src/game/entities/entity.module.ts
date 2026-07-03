import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonstersService } from './monsters.service';
import { Monster } from './monsters.entity';
import { Skill } from './skills.entity';
import { Tile } from './tiles.entity';
import { Item } from './items.entity';
import { MapEntity } from './maps.entity';

@Module({
  providers: [MonstersService],
  imports: [TypeOrmModule.forFeature([MapEntity, Tile, Monster, Skill, Item])],
  exports: [MonstersService],
})
export class EntityModule {}
