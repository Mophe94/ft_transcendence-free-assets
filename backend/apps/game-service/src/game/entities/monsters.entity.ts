import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MonsterType } from './types/monster_type.enum';
import { Skill } from './skills.entity';

@Entity()
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

  @Column()
  catch!: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @ManyToMany(() => Skill, (skill: Skill) => skill.monsters)
  @JoinTable({
    name: 'monster_skill',
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
}
