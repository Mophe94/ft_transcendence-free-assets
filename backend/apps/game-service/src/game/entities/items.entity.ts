import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MonsterStat } from './types/monster_stat.enum';

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
    enum: MonsterStat,
    name: 'target',
    nullable: true,
  })
  @Column()
  scene!: string;

  target!: MonsterStat;
}
