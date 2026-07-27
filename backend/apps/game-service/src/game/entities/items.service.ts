import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { FindOptionsRelations, Repository } from 'typeorm';

export class ItemsService {
  constructor(@InjectRepository(Item) private repo: Repository<Item>) {}

  findOneById(
	id: number,
	relations: FindOptionsRelations<Item> = {},
  ): Promise<Item | null> {
	return this.repo.findOne({
	  where: { id },
	  relations,
	});
  }

  findOneByName(
	name: string,
	relations: FindOptionsRelations<Item> = {},
  ): Promise<Item | null> {
	return this.repo.findOne({
	  where: { name },
	  relations,
	});
  }
}