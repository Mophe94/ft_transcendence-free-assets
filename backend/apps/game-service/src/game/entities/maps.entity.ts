import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tile } from './tiles.entity';

@Entity('maps')
export class MapEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Tile, (tile: Tile) => tile.maps)
  @JoinTable({
    name: 'maps_tiles',
    joinColumn: {
      name: 'map_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tile_id',
      referencedColumnName: 'id',
    },
  })
  tiles!: Tile[];
}
