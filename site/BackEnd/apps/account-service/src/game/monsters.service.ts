import { InjectRepository } from 'node_modules/@nestjs/typeorm';
import { Monster } from './monsters.entity';
import { FindOptionsRelations, Repository } from 'typeorm';

export class MonstersService {
  constructor(@InjectRepository(Monster) private repo: Repository<Monster>) {}

  findOneById(
    id: number,
    relations: FindOptionsRelations<Monster> = {},
  ): Promise<Monster | null> {
    return this.repo.findOne({
      where: { id },
      relations,
    });
  }

  findOneByName(
    name: string,
    relations: FindOptionsRelations<Monster> = {},
  ): Promise<Monster | null> {
    return this.repo.findOne({
      where: { name },
      relations,
    });
  }
}
