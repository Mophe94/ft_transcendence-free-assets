import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/users.entity';

export enum RelationshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
}

@Entity('relationships')
export class Relationship {
  @PrimaryColumn({ name: 'requester_id', type: 'uuid' })
  requesterId!: string;

  @ManyToOne(() => User, (user) => user.sentRelationships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester!: User;

  @PrimaryColumn({ name: 'accepter_id', type: 'uuid' })
  accepterId!: string;

  @ManyToOne(() => User, (user) => user.receivedRelationships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accepter_id' })
  accepter!: User;

  @Column({
    type: 'enum',
    enum: RelationshipStatus,
    enumName: 'relationship_status_type',
    default: RelationshipStatus.PENDING,
  })
  status!: RelationshipStatus;

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

  // @AfterInsert()
  // logInsert() {
  //   console.log(
  //     `account:\n\t${this.requesterId}`,
  //     `\n\t${this.accepterId}`,
  //     `\n\t${this.status}`,
  //     `\n\t${this.createdAt.toLocaleTimeString()}`,
  //     `\n\t${this.updatedAt.toLocaleTimeString()}`,
  //   );
  // }
}
