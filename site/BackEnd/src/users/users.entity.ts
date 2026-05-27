import { Settings } from 'src/settings/settings.entity';
import { UserStats } from 'src/stats/stats.entity';
import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  fortyTwoId!: number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  avatarUrl!: string;

  @OneToOne(() => Settings, (settings) => settings.user, { cascade: true })
  settings!: Settings;

  @OneToOne(() => UserStats, (stats) => stats.user, { cascade: true })
  stats!: UserStats;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @AfterInsert()
  logInsert() {
    console.log(
      `User:\n\t${this.id}`,
      `\n\t${this.username}`,
      `\n\t${this.email}`,
      `\n\t${this.avatarUrl}`,
      `\n\t${this.created_at.toLocaleTimeString()}`,
    );
  }
}
