import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { FortyTwoUser } from './types/users.interface';
import { Settings } from 'src/settings/settings.entity';

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

  create(fortyTwoUser: FortyTwoUser) {
    const newUser = this.repo.create(fortyTwoUser);
    newUser.settings = new Settings(newUser);
    return this.repo.save(newUser);
  }
}
