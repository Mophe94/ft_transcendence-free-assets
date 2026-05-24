import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @AfterInsert()
  logInsert() {
    console.log(
      `User:\n\t${this.id}`,
      `\n\t${this.username}`,
      `\n\t${this.email}`,
      `\n\t${this.avatarUrl}`,
    );
  }
}
