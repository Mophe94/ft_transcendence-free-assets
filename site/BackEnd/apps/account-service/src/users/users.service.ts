import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { FortyTwoUser } from './types/users.interface';
import { Settings } from 'apps/account-service/src/settings/settings.entity';
import { UserStats } from 'apps/account-service/src/stats/stats.entity';

export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findOneById(
    id: number,
    relations: FindOptionsRelations<User> = {},
  ): Promise<User | null> {
    return this.repo.findOne({
      where: { id },
      relations,
    });
  }

  findOneByFortyTwoId(
    id: number,
    relations: FindOptionsRelations<User> = {},
  ): Promise<User | null> {
    return this.repo.findOne({
      where: { fortyTwoId: id },
      relations,
    });
  }

  findOneByUsername(
    username: string,
    relations: FindOptionsRelations<User> = {},
  ): Promise<User | null> {
    return this.repo.findOne({
      where: { username },
      relations,
    });
  }

  findStatsById(id: number) {
    return this.findOneById(id, { stats: true });
  }

  findStatsByUsername(username: string) {
    return this.findOneByUsername(username, { stats: true });
  }

  findSettingsById(id: number) {
    return this.findOneById(id, { settings: true });
  }

  findSettingsByUsername(username: string) {
    return this.findOneByUsername(username, { settings: true });
  }

  create(fortyTwoUser: FortyTwoUser) {
    const newUser = this.repo.create(fortyTwoUser);
    newUser.settings = new Settings(newUser);
    newUser.stats = new UserStats(newUser);
    return this.repo.save(newUser);
  }
}
