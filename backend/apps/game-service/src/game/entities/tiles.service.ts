import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Tile } from './tiles.entity';

export class TilesService {
  constructor(@InjectRepository(Tile) private repo: Repository<Tile>) {}

  findOneByType(
    type: string,
    relations: FindOptionsRelations<Tile> = {},
  ): Promise<Tile | null> {
    return this.repo.findOne({
      where: { type },
      relations,
    });
  }
}
