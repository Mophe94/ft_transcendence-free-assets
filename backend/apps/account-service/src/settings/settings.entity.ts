import { User } from 'apps/account-service/src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Settings {
  constructor(user?: User) {
    if (user) {
      this.user = user;
    }
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'dark' })
  theme!: string;

  @Column({ default: 0 })
  starter!: number;

  @Column({ default: 'ghost02', length: 30 })
  avatar!: string;

  @OneToOne(() => User, (user) => user.settings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
