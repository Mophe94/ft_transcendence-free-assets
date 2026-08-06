import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../types/userRole.enum';
import { Account } from './accounts.entity';
import { Relationship } from './relationships.entity';
import type { UserSettings } from '../types/userSettings.interface';
import { UserStats } from '../../stats/stats.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    unique: true,
  })
  username!: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  passwordHash!: string;

  @Column({
    name: 'is_onboarded',
    type: 'boolean',
    default: false,
  })
  isOnboarded!: boolean;

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

  @Column({
    name: 'avatar_url',
    type: 'text',
    nullable: true,
  })
  avatarUrl!: string;

  @Column({
    name: 'coalition_id',
    type: 'integer',
    default: 0,
  })
  coalitionId!: number;

  @Column({
    type: 'jsonb',
    default: {
      theme: 'dark',
      starter: 'pisciner',
      skin: 'dinoGreen',
    },
  })
  settings!: UserSettings;

  @Column({
    name: 'user_roles',
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_type',
    array: true,
    default: [UserRole.USER],
  })
  userRoles!: UserRole[];

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @OneToOne(() => UserStats, (stats) => stats.user, { cascade: true })
  stats!: UserStats;

  @OneToMany(() => Relationship, (rel) => rel.requester)
  sentRelationships!: Relationship[];

  @OneToMany(() => Relationship, (rel) => rel.accepter)
  receivedRelationships!: Relationship[];

  @AfterInsert()
  logInsert() {
    console.log(
      `User:\n\t${this.id}`,
      `\n\t${this.username}`,
      `\n\t${this.email}`,
      `\n\t${this.avatarUrl}`,
      `\n\t${this.createdAt.toLocaleTimeString()}`,
    );
  }
}
