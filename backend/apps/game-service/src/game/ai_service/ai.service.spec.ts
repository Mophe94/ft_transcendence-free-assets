import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { Player } from '../player/player';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBotPlayer - mode "hardcoded"', () => {
    it('should create a new Player instance', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot).toBeInstanceOf(Player);
    });

    it('should assign the given botId', () => {
      const bot = service.createBotPlayer('hardcoded', -42);

      expect(bot.id).toBe(-42);
    });

    it('should default the botId to -1 when not provided', () => {
      const bot = service.createBotPlayer('hardcoded');

      expect(bot.id).toBe(-1);
    });

    it('should default the mode to "hardcoded" when not provided', () => {
      const bot = service.createBotPlayer();

      expect(bot.name).toBe('Bot IA');
    });

    it('should set isBot to true', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.isBot).toBe(true);
    });

    it('should set the name to "Bot IA"', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.name).toBe('Bot IA');
    });

    it('should populate battle_team slot 0 with "Pisciner Bot"', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.battle_team[0]).toMatchObject({
        name: 'Pisciner Bot',
        slot: 0,
        type: 'Water',
        life: { current: 100, max: 100 },
      });
    });

    it('should populate the correct skills for the hardcoded monster', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.battle_team[0].skill[0]).toMatchObject({
        name: 'Pistolet Eau',
        current: 10,
        max: 10,
        type: 'Water',
      });
      expect(bot.battle_team[0].skill[1]).toMatchObject({
        name: 'Charge',
        current: 15,
        max: 15,
        type: 'Normal',
      });
    });

    it('should leave skill slots 2 and 3 empty', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.battle_team[0].skill[2]).toMatchObject({
        name: '',
        current: 0,
        max: 0,
        type: '',
      });
      expect(bot.battle_team[0].skill[3]).toMatchObject({
        name: '',
        current: 0,
        max: 0,
        type: '',
      });
    });

    it('should set currentMonster to reference battle_team[0]', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.currentMonster).toEqual(bot.battle_team[0]);
    });

    it('should not mutate battle_team slots 1 and 2 (left at default)', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.battle_team[1].name).toBe('');
      expect(bot.battle_team[2].name).toBe('');
    });
  });

  describe('createBotPlayer - mode "takeover"', () => {
    it('should return the same Player instance (mutated), not a new one', () => {
      const human = new Player(5, 'Alice', 'alice_avatar');

      const result = service.createBotPlayer('takeover', -1, human);

      expect(result).toBe(human);
    });

    it('should set isBot to true on the human player', () => {
      const human = new Player(5, 'Alice', 'alice_avatar');

      const result = service.createBotPlayer('takeover', -1, human);

      expect(result.isBot).toBe(true);
    });

    it('should preserve the original player id and name', () => {
      const human = new Player(5, 'Alice', 'alice_avatar');

      const result = service.createBotPlayer('takeover', -1, human);

      expect(result.id).toBe(5);
      expect(result.name).toBe('Alice');
    });

    it('should preserve the original battle_team untouched', () => {
      const human = new Player(5, 'Alice', 'alice_avatar');
      human.battle_team[0].name = 'MonstreAlice';
      human.battle_team[0].life = { current: 30, max: 50 };

      const result = service.createBotPlayer('takeover', -1, human);

      expect(result.battle_team[0].name).toBe('MonstreAlice');
      expect(result.battle_team[0].life).toEqual({ current: 30, max: 50 });
    });

    it('should preserve the original inventory untouched', () => {
      const human = new Player(5, 'Alice', 'alice_avatar');
      human.inventory[0] = {
        name: 'Potion',
        scene: 'battle',
        current: 2,
        value: 20,
      };

      const result = service.createBotPlayer('takeover', -1, human);

      expect(result.inventory[0]).toEqual({
        name: 'Potion',
        scene: 'battle',
        current: 2,
        value: 20,
      });
    });

    it('should fall back to hardcoded bot if mode is "takeover" but humanToReplace is missing', () => {
      const bot = service.createBotPlayer('takeover', -1, undefined);

      expect(bot.name).toBe('Bot IA');
      expect(bot.isBot).toBe(true);
      expect(bot.battle_team[0].name).toBe('Pisciner Bot');
    });
  });
});