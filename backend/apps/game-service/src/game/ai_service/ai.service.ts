import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Player } from '../player/player';
import { BOT_TEAM_TIERS, BOT_NAMES, BOT_SKINS, MONSTER_TYPES, BOT_ITEMS, BOT_ITEM_COUNTS, BotTeamTier } from './bot.data';
import { GameData } from '../game.type';

export type BotMode = 'hardcoded' | 'takeover';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  pickBotName(usedNames: Set<string>): string {
    const available = BOT_NAMES.filter((name) => !usedNames.has(name));
    const pool = available.length > 0 ? available : BOT_NAMES;
    const name = pool[Math.floor(Math.random() * pool.length)];
    usedNames.add(name);
    return name;
  }

  pickBotSkin(): string {
  return BOT_SKINS[Math.floor(Math.random() * BOT_SKINS.length)];
  }

  getLobbySkin(gameSkin: string): string {
    return BOT_SKINS.includes(gameSkin) ? gameSkin : BOT_SKINS[0];
  }

  private readonly typeChart: Record<string, Record<string, number>> = {
    fire: { plant: 2, water: 0.5, neutral: 1, earth: 1, fly: 1 },
    water: { fire: 2, plant: 0.5, earth: 0.5, neutral: 1, fly: 1 },
    earth: { water: 2, fire: 0.5, plant: 0.5, neutral: 1, fly: 1 },
    plant: { water: 2, earth: 2, neutral: 1, fire: 0.5, fly: 0.5 },
    neutral: { water: 1, fire: 1, plant: 1, earth: 1, fly: 1 },
    fly: { water: 1, fire: 1, plant: 2, earth: 0.5, neutral: 1 },
  };

  chooseBattleTeam(botTeam: string[], enemyTeam: string[]): string[] {
    console.log(botTeam);
    const enemyTypes = enemyTeam
    .filter((name) => name !== '')
    .map((name) => MONSTER_TYPES[name])
    .filter((type): type is string => !!type);
    
    const scored = botTeam
    .filter((name) => name !== '')
    .map((name) => {
      const type = MONSTER_TYPES[name];
      const score =
      enemyTypes.length === 0
      ? 1
      : enemyTypes.reduce(
        (sum, enemyType) => sum + (this.typeChart[type]?.[enemyType] ?? 1),
        0,
      ) / enemyTypes.length;
      return { name, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((entry) => entry.name);
  }

  decideCombatAction(bot: Player, enemy: Player): GameData {
    if (bot.currentMonster.name === '' || bot.currentMonster.life.current <= 0) {
      const slot = this.pickBestMonsterSlot(bot, enemy);
      const chosen = bot.battle_team[slot];
      this.logger.log(
        `[AiService] Bot ${bot.id} envoie ${chosen?.name ?? '?'} (type: ${chosen?.type ?? '?'}, ${chosen?.life?.current ?? '?'}/${chosen?.life?.max ?? '?'} PV, slot ${slot})`,
      );
      return { state: 'change_current_monster', slot };
    }

    const itemAction = this.pickUsefulItem(bot, enemy);
    if (itemAction) return itemAction;

    const skillName = this.pickBestSkill(bot, enemy);
    if (!skillName) return { state: 'pass' };
    return { state: 'try_attack', skill: skillName };
  }

  private pickUsefulItem(bot: Player, enemy: Player): GameData | undefined {
    const lifeRatio = bot.currentMonster.life.current / bot.currentMonster.life.max;
    const potion = bot.inventory.find((item) => item.name === 'potion' && item.current > 0);
    if (lifeRatio < 0.5 && potion) {
      return { state: 'use_item_combat', item: 'potion' };
    }

    const bomb = bot.inventory.find((item) => item.name === 'bomb' && item.current > 0);
    const enemyLife = enemy.currentMonster.life.current;
    if (bomb && enemyLife > 0 && enemyLife <= bomb.value) {
      return { state: 'use_item_combat', item: 'bomb' };
    }

    return undefined;
  }

  private pickBestMonsterSlot(bot: Player, enemy: Player): number {
    const enemyType = enemy.currentMonster?.name ? enemy.currentMonster.type : undefined;

    let bestSlot = -1;
    let bestScore = -Infinity;

    bot.battle_team.forEach((monster, slot) => {
      if (monster.name === '' || monster.life.current <= 0) return;
      const score = enemyType
        ? (this.typeChart[monster.type]?.[enemyType] ?? 1)
        : monster.attack;
      if (score > bestScore) {
        bestScore = score;
        bestSlot = slot;
      }
    });

    return bestSlot;
  }

  private pickBestSkill(bot: Player, enemy: Player): string | undefined {
    const enemyType = enemy.currentMonster.type;

    const usableSkills = bot.currentMonster.skill.filter(
      (skill) => skill.effect === 'damage' && skill.current > 0,
    );
    if (usableSkills.length === 0) return undefined;

    let best = usableSkills[0];
    let bestScore = -Infinity;

    for (const skill of usableSkills) {
      const multiplier = this.typeChart[skill.type]?.[enemyType] ?? 1;
      const score = skill.value * multiplier * skill.repetition;
      if (score > bestScore) {
        bestScore = score;
        best = skill;
      }
    }

    return best.name;
  }

  generateBotId(): string {
    return `bot-${randomUUID()}`;
  }

  /**
   * Détermine le palier (faible/moyen/fort) correspondant à l'avancement
   * dans le bracket. Utilisé à la fois pour choisir l'équipe (feature 3)
   * et pour équiper les objets (feature 3 étendue).
   *
   * @param round        Round courant du bracket (1-indexed)
   * @param totalRounds  Nombre total de rounds du bracket (Math.log2(FULL))
   */
  private pickTierName(round: number, totalRounds: number): BotTeamTier {
    if (totalRounds <= 1) return 'fort'; // tournoi à 1 round = direct la finale
    return round > totalRounds / 2 ? 'fort' : 'faible';
  }

  private pickTeamFromTier(tier: BotTeamTier): readonly string[] {
    const pool = BOT_TEAM_TIERS[tier];
    return pool[Math.floor(Math.random() * pool.length)];
  }


  private equipBotItems(bot: Player, tier: BotTeamTier): void {
    const counts = BOT_ITEM_COUNTS[tier];
    let slot = 0;

    for (const [name, count] of Object.entries(counts)) {
      if (count <= 0 || slot >= bot.inventory.length) continue;
      const meta = BOT_ITEMS[name];
      if (!meta) continue;

      bot.inventory[slot] = {
        name,
        scene: meta.scene,
        type: meta.type,
        current: count,
        value: meta.value,
        target: '',
      };
      slot++;
    }
  }

  public refreshBotLoadout(bot: Player, round: number, totalRounds: number): void {
  const tier = this.pickTierName(round, totalRounds);
  bot.team = [...this.pickTeamFromTier(tier)];
  this.equipBotItems(bot, tier);
  }

  createBotPlayer(
    mode: BotMode,
    round: number,
    totalRounds: number,
    botId?: string,
    humanToReplace?: Player,
    botName?: string,
  ): Player {
    const tier = this.pickTierName(round, totalRounds);

    if (mode === 'takeover' && humanToReplace) {
      this.logger.log(
        `[AiService] Prise de contrôle du joueur ${humanToReplace.id} par l'IA (déconnexion)`,
      );
      humanToReplace.isBot = true;
      if (humanToReplace.currentPhase == 'map') {
        humanToReplace.team = [...this.pickTeamFromTier(tier)];
        this.equipBotItems(humanToReplace,tier)
      }
      return humanToReplace;
    }
    
    const team = this.pickTeamFromTier(tier);
    const id = botId ?? this.generateBotId();
    const skin = this.pickBotSkin();

    const bot = new Player(id, botName ?? 'Bot IA', "-1", skin);
    bot.isBot = true;
    bot.team = [...team];
    this.equipBotItems(bot, tier);

    this.logger.log(
      `[AiService] Instanciation du bot ${id} (round ${round}/${totalRounds}, palier ${tier}, skin ${skin}), équipe: ${team.join(', ')}`,
    );

    return bot;
  }
}