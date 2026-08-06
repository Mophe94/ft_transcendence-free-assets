import { Test, TestingModule } from '@nestjs/testing';
import { AiService, BOT_SKINS } from './ai.service';
import { Player } from '../player/player';
import { PREDEFINED_BOT_TEAMS } from './bot-teams.data';

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

  describe('generateBotId', () => {
    it('should return a negative number', () => {
      const id = service.generateBotId();

      expect(id).toBeLessThan(0);
    });

    it('should return a different id on each call', () => {
      const first = service.generateBotId();
      const second = service.generateBotId();

      expect(second).not.toBe(first);
    });

    it('should never collide across many calls', () => {
      const ids = new Set<number>();
      for (let i = 0; i < 50; i++) {
        ids.add(service.generateBotId());
      }

      expect(ids.size).toBe(50);
    });
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

    it('should populate all 3 battle_team slots with one of the predefined teams', () => {
      const bot = service.createBotPlayer('hardcoded', -1);
      const names = bot.battle_team.map((m) => m.name);

      expect(names.every((n) => n !== '')).toBe(true);

      const matchesATeam = PREDEFINED_BOT_TEAMS.some(
        (team) => JSON.stringify(team.map((m) => m.name)) === JSON.stringify(names),
      );
      expect(matchesATeam).toBe(true);
    });

    it('should give each monster at least one usable skill', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      for (const monster of bot.battle_team) {
        const usableSkills = monster.skill.filter((s) => s.name !== '');
        expect(usableSkills.length).toBeGreaterThan(0);
      }
    });

    it('should set currentMonster to reference battle_team[0]', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(bot.currentMonster).toEqual(bot.battle_team[0]);
    });

    it('should not share team references between two bots (deep clone)', () => {
      // On force Math.random à piocher systématiquement la même équipe (index 0)
      // pour tester le clonage sans dépendre du hasard.
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0);
      const botA = service.createBotPlayer('hardcoded', -1);
      const botB = service.createBotPlayer('hardcoded', -2);
      randomSpy.mockRestore();

      expect(botA.battle_team[0].name).toBe(botB.battle_team[0].name);

      botA.battle_team[0].life.current = 1;

      expect(botB.battle_team[0].life.current).not.toBe(1);
    });

    it('should assign one of the valid bot skins', () => {
      const bot = service.createBotPlayer('hardcoded', -1);

      expect(BOT_SKINS).toContain(bot.asset);
    });

    it('should not always assign the same skin across many bots', () => {
      const skins = new Set<string>();
      for (let i = 0; i < 30; i++) {
        skins.add(service.createBotPlayer('hardcoded', -1).asset);
      }

      // Sur 30 tirages parmi 10 skins, retomber systématiquement sur le même
      // serait quasi impossible si le tirage est bien aléatoire (pas un vrai flaky test).
      expect(skins.size).toBeGreaterThan(1);
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
        type: '',
        target: '',
      };

      const result = service.createBotPlayer('takeover', -1, human);

      expect(result.inventory[0]).toEqual({
        name: 'Potion',
        scene: 'battle',
        current: 2,
        value: 20,
        type: '',
        target: '',
      });
    });

    it('should fall back to a hardcoded bot if mode is "takeover" but humanToReplace is missing', () => {
      const bot = service.createBotPlayer('takeover', -1, undefined);

      expect(bot.name).toBe('Bot IA');
      expect(bot.isBot).toBe(true);
      expect(bot.battle_team.every((m) => m.name !== '')).toBe(true);
    });
  });
});