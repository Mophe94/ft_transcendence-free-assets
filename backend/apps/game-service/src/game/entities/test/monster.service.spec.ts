import { Test, TestingModule } from '@nestjs/testing';

import { TypeOrmModule } from '@nestjs/typeorm';
import { MonstersService } from '../monsters.service';
import { Monster } from '../monsters.entity';
import { Tile } from '../tiles.entity';
import { MapEntity } from '../maps.entity';
import { Skill } from '../skills.entity';
import { Item } from '../items.entity';

describe('MonstersService - Integration', () => {
  let service: MonstersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        // On se connecte à ta base locale/Docker pour le test
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'game_db',
          port: 5432,
          username: 'kprist',
          password: '12345',
          database: 'game_db',
          entities: [Monster, Tile, MapEntity, Skill, Item],
          synchronize: false, // On utilise tes données existantes du dump
        }),
        TypeOrmModule.forFeature([Monster, Tile]),
      ],
      providers: [MonstersService],
    }).compile();

    service = module.get<MonstersService>(MonstersService);
  });

  afterAll(async () => {
    await module.close(); // Pense à fermer la connexion
  });

  it('devrait retourner les monstres de la tuile 3', async () => {
    // Si on regarde ton dump, la tuile 3 contient les monstres 10, 9 et 8
    const monsters = await service.findMonstersByTile(3);

    console.log('Monstres trouvés :', monsters);
    expect(monsters).toBeDefined();
    expect(monsters.length).toBeGreaterThan(0);
  });
});
