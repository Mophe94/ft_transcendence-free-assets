import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MonsterType } from './types/monster_type.enum';
import { Skill } from './skills.entity';
import { Tile } from './tiles.entity';
import { MonsterRarity } from './types/monster_rarity.enum';

@Entity('monsters')
export class Monster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  hp_total!: number;

  @Column()
  attack!: number;

  @Column()
  attack_spe!: number;

  @Column()
  defense!: number;

  @Column()
  defense_spe!: number;

  @Column()
  speed!: number;

  @Column({
    type: 'enum',
    enum: MonsterType,
  })
  type!: MonsterType;

  @Column({
    type: 'enum',
    enum: MonsterRarity,
  })
  rarity!: MonsterRarity;

  /*   @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date; */

  @ManyToMany(() => Skill, (skill: Skill) => skill.monsters)
  @JoinTable({
    name: 'monsters_skills',
    joinColumn: {
      name: 'monster_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
    },
  })
  skills!: Skill[];

  @ManyToMany(() => Tile, (tile: Tile) => tile.monsters)
  tiles!: Tile[];
}
