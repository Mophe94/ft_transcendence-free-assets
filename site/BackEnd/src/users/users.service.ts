import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { FortyTwoUser } from './types/users.interface';

export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findByFortyTwoId(id: number): Promise<User | null> {
    return await this.repo.findOne({
      where: { fortyTwoId: id },
    });
  }
  async findByUsername(username: string): Promise<User | null> {
    return await this.repo.findOne({
      where: { username },
    });
  }

  create(forty_two_user: FortyTwoUser) {
    const db_user = this.repo.create(forty_two_user);
    return this.repo.save(db_user);
  }
}
