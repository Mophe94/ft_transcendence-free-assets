import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserStats } from '../stats/stats.entity';
import { Account } from './entities/accounts.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
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
      const savedUser = await this.userRepo.save(user);

      this.logger.log(
        `[USERS] Created local user: ${savedUser.username} (${savedUser.id})`,
      );

      return savedUser;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const pgError = error as unknown as { code?: string; detail?: string };

        if (pgError.code === '23505') {
          const detail = pgError.detail ?? '';

          if (detail.includes('email')) {
            this.logger.warn(`[USERS DB CONFLICT] Email already used`);
            throw new ConflictException('Email already used.');
          }
          if (detail.includes('username')) {
            this.logger.warn(`[USERS DB CONFLICT] Username already used`);
            throw new ConflictException('Username already used.');
          }

          this.logger.warn(`[USERS DB CONFLICT] User already exists`);
          throw new ConflictException('User already exists.');
        }
      }

      this.logger.error(
        `[USERS DB ERROR] Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
      );
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

      this.logger.log(
        `[USERS] Created 42 user & linked account: ${savedUser.username} (${savedUser.id}) - 42 ID: ${fortyTwoId}`,
      );
      return savedUser;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const pgError = error as unknown as { code?: string; detail?: string };

        if (pgError.code === '23505') {
          const detail = pgError.detail ?? '';

          if (detail.includes('email')) {
            this.logger.warn(`[USERS DB CONFLICT] 42 Email already used`);
            throw new ConflictException('Email already used.');
          }
          if (detail.includes('username')) {
            this.logger.warn(`[USERS DB CONFLICT] 42 Username already used`);
            throw new ConflictException('Username already used.');
          }

          this.logger.warn(`[USERS DB CONFLICT] 42 User already exists`);
          throw new ConflictException('User already exists.');
        }
      }

      this.logger.error(
        `[USERS DB ERROR] Failed to create 42 user: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  async findOneByEmail(
    email: string,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const query = this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email.trim() });

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
      .where('user.username = :username', { username: username.trim() });

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

    while (await this.userRepo.exists({ where: { username: candidate } })) {
      this.logger.debug(
        `[USERS] Username collision for '${candidate}', trying suffix _${counter}`,
      );
      candidate = `${baseUsername}_${counter}`;
      counter++;
    }

    return candidate;
  }

  async isEmailAvailable(email: string) {
    const exists = await this.userRepo.exists({
      where: { email: email.trim().toLowerCase() },
    });

    return !exists;
  }

  async findUserByFortyTwoId(fortyTwoId: number) {
    const user = this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.accounts', 'account')
      .where('account.provider_account_id = :userId', {
        userId: String(fortyTwoId),
      })
      .getOne();
    return user;
  }

  async findByIdentifier(identifier: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
    });
  }
}
