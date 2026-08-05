import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MapEntity } from './maps.entity';
import { Monster } from './monsters.entity';

@Entity('tiles')
export class Tile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  type!: string;

  @ManyToMany(() => MapEntity, (map: MapEntity) => map.tiles)
  maps!: MapEntity[];

  @ManyToMany(() => Monster, (monster: Monster) => monster.tiles)
  @JoinTable({
    name: 'tiles_monsters',
    joinColumn: {
      name: 'tile_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'monster_id',
      referencedColumnName: 'id',
    },
  })
  monsters!: Monster[];
}
