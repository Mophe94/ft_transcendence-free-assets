import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './items.entity';
import { FindOptionsRelations, Repository } from 'typeorm';

export class ItemsService {
  constructor(@InjectRepository(Item) private repo: Repository<Item>) {}

  // retrive all items for map1
  findAll(
	relations: FindOptionsRelations<Item> = {},
  ): Promise<Item[] | null> {
	return this.repo.find({
		relations
	});
  }
}
