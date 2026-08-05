import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';

export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  async createUser(userData: Partial<User>) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
    });
  }
}
