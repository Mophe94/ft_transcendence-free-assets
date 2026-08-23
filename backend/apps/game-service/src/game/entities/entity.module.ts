import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonstersService } from './monsters.service';
import { ItemsService } from './items.service';
import { TilesService } from './tiles.service';
import { Monster } from './monsters.entity';
import { Skill } from './skills.entity';
import { Tile } from './tiles.entity';
import { Item } from './items.entity';
import { MapEntity } from './maps.entity';
import { MapsService } from './maps.service';

@Module({
  providers: [MonstersService, TilesService, ItemsService, MapsService],
  imports: [TypeOrmModule.forFeature([MapEntity, Tile, Monster, Skill, Item])],
  exports: [MonstersService, TilesService, ItemsService, MapsService],
})
export class EntityModule {}
