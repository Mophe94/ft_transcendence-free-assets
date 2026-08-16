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
    name: 'total_players_defeated',
    default: 0,
  })
  totalPlayersDefeated!: number;

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
    name: 'nb_monsters_discovered',
    default: 0,
  })
  nbMonstersDiscovered!: number;

  @Column({
    name: 'nb_endings_discovered',
    default: 0,
  })
  nbEndingsDiscovered!: number;

  @Column({
    name: 'nb_achievements',
    default: 0,
  })
  nbAchievements!: number;

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
