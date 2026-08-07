import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { MapEntity } from './maps.entity';

export class MapsService {
	constructor(@InjectRepository(MapEntity) private repo: Repository<MapEntity>) {}

	findOneById(
		id: number,
		relations: FindOptionsRelations<MapEntity> = {},
	): Promise<MapEntity | null> {
		return this.repo.findOne({
		where: { id },
		relations,
		});
	}

	findOneByName(
		name: string,
		relations: FindOptionsRelations<MapEntity> = {},
	): Promise<MapEntity | null> {
		return this.repo.findOne({
		where: { name },
		relations,
		});
	}
}