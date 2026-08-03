import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SkillEffect } from './types/skill_effect.enum';
import { SkillType } from './types/skill_type.entity';
import { MonsterStat } from './types/monster_stat.enum';
import { Monster } from './monsters.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  power_point!: number;

  @Column({
    type: 'enum',
    enum: SkillEffect,
  })
  effect!: SkillEffect;

  @Column({
    type: 'enum',
    enum: SkillType,
  })
  type!: SkillType;

  @Column()
  value!: number;

  @Column()
  repetition!: number;

  @Column()
  precision!: number;

  @Column({
    type: 'enum',
    enum: MonsterStat,
  })
  data!: MonsterStat;

  @ManyToMany(() => Monster, (monster: Monster) => monster.skills)
  monsters!: Monster[];
}
