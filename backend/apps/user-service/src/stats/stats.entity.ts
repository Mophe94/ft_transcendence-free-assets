import { User } from '../users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_stats')
export class UserStats {
  @PrimaryColumn({
    name: 'user_id',
    type: 'uuid',
  })
  userId!: string;

  @OneToOne(() => User, (user) => user.stats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    name: 'total_player_defeated',
    default: 0,
  })
  totalPlayerDefeated!: number;

  @Column({
    name: 'games_won',
    default: 0,
  })
  gamesWon!: number;

  @Column({
    name: 'games_lost',
    default: 0,
  })
  gamesLost!: number;

  @Column({
    name: 'games_played',
    default: 0,
  })
  gamesPlayed!: number;

  @Column({
    name: 'monsters_discovered',
    type: 'text',
	array: true,
    default: '{}',
  })
  MonstersDiscovered!: string[];

  @Column({
    name: 'nb_monsters_discovered',
    default: 0,
  })
  NbMonstersDiscovered!: number;

  @Column({
    name: 'endings_discovered',
    type: 'text',
	array: true,
   default: '{}',
  })
  EndingsDiscovered!: string[];

  @Column({
    name: 'nb_endings_discovered',
    default: 0,
  })
  NbEndingsDiscovered!: number;

  @Column({
    name: 'achievements',
	type: 'text',
	array: true,
    default: '{}',
  })
  Achievements!: string[];

  @Column({
    name: 'nb_achievements',
    default: 0,
  })
  NbAchievements!: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;
}
