import { User } from 'apps/account-service/src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserStats {
  constructor(user: User) {
    this.user = user;
  }
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  total_damage_given!: number;

  @Column({ default: 0 })
  total_damage_received!: number;

  @Column({ default: 0 })
  nb_victories!: number;

  @Column({ default: 0 })
  nb_defeats!: number;

  @Column({
    type: 'int',
    asExpression: '"nb_victories" + "nb_defeats"',
    generatedType: 'STORED',
  })
  nb_fights!: number;

  @Column({ default: 0 })
  nb_monsters_discovered!: number;

  @Column({ default: 0 })
  nb_objects_discovered!: number;

  @Column({ default: 0 })
  nb_achievements!: number;

  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn()
  user!: User;
}
