import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserStats } from '../stats/stats.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserStats) private statsRepo: Repository<UserStats>,
  ) {}
  async createUser(userData: Partial<User>) {
    try {
      const user = this.userRepo.create({
        ...userData,
        stats: this.statsRepo.create(),
      });
      return await this.userRepo.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        const detail = (error as any).detail as string;

        if (detail?.includes('email')) {
          throw new ConflictException('Email already used.');
        }
        if (detail?.includes('username')) {
          throw new ConflictException('Username already used.');
        }

        throw new ConflictException('User already exists.');
      }
      throw error;
    }
  }

  async findOneByEmail(
    email: string,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const query = this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (withPassword) {
      query.addSelect('user.passwordHash');
    }
    return query.getOne();
  }
  async findProfileByUsername(
    username: string,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const query = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.stats', 'stats')
      .where('user.username = :username', { username });

    if (withPassword) {
      query.addSelect('user.passwordHash');
    }
    return query.getOne();
  }
}
