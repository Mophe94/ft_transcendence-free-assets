import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  async createUser(userData: Partial<User>) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async findOneByEmail(
    email: string,
    withPassword: boolean = false,
  ): Promise<User | null> {
    const query = this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (withPassword) {
      query.addSelect('user.passwordHash');
    }
    return query.getOne();
  }
}
