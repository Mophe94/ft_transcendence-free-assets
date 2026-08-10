import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserStats } from '../stats/stats.entity';
import { Account } from './entities/accounts.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Account) private accountRepo: Repository<Account>,
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

  async createFortyTwoUser(userData: {
    email: string;
    username: string;
    avatarUrl?: string;
    coalitionId?: number;
    fortyTwoId: number;
  }) {
    const { fortyTwoId, username: baseUsername, ...profileData } = userData;

    const uniqueUsername = await this.generateUniqueUsername(baseUsername);

    try {
      const user = this.userRepo.create({
        ...profileData,
        username: uniqueUsername,
        stats: this.statsRepo.create(),
      });
      const savedUser = await this.userRepo.save(user);
      const account = this.accountRepo.create({
        provider: '42',
        providerAccountId: fortyTwoId,
        userId: savedUser.id,
      });
      await this.accountRepo.save(account);

      return savedUser;
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

  async isUsernameAvailable(username: string) {
    const exists = await this.userRepo.exists({
      where: { username: username.trim() },
    });

    return !exists;
  }

  private async generateUniqueUsername(baseUsername: string): Promise<string> {
    let candidate = baseUsername;
    let counter = 1;

    while (await this.userRepo.findOne({ where: { username: candidate } })) {
      candidate = `${baseUsername}_${counter}`;
      counter++;
    }

    return candidate;
}

  async isEmailAvailable(email: string) {
    const exists = await this.userRepo.exists({
      where: { email: email.trim() },
    });

    return !exists;
  }

  async findUserByFortyTwoId(fortyTwoId: number) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.accounts', 'account')
      .where('account.provider_account_id = :userId', { userId: String(fortyTwoId) })
      .getOne();
    return user;
  }
}
