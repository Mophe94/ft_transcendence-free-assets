import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MonsterStat } from './types/monster_stat.enum';
import { ItemType } from './types/item_type.enum';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  value!: number;

  @Column({
    type: 'enum',
    enum: ItemType,
    name: 'target',
    nullable: true,
  })
  target!: MonsterStat;

  @Column()
  scene!: string;

  @Column({
    type: 'enum',
    enum: ItemType,
    name: 'type',
    nullable: true,
  })
  type!: string;
}
