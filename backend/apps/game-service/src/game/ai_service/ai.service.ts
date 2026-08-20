import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Player } from '../player/player';
import { BOT_TEAM_TIERS, BOT_NAMES, BOT_SKIN_PAIRS, MONSTER_TYPES, BOT_ITEMS, BOT_ITEM_COUNTS, BotTeamTier } from './bot.data';
import { GameData } from '../game.type';

export type BotMode = 'hardcoded' | 'takeover';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  /**
   * Picks a bot name that isn't already taken in the caller's set.
   * `usedNames` is owned by the caller (typically one room's worth of
   * bots created in the same loop) and gets mutated here, so calling
   * this several times in a row never returns the same name twice.
   */
  pickBotName(usedNames: Set<string>): string {
    const available = BOT_NAMES.filter((name) => !usedNames.has(name));
    // Fallback: if somehow every name in the pool is already taken
    // (shouldn't happen given room sizes), just allow a repeat rather
    // than crash.
    const pool = available.length > 0 ? available : BOT_NAMES;
    const name = pool[Math.floor(Math.random() * pool.length)];
    usedNames.add(name);
    return name;
  }

  /**
   * Pioche un skin au hasard parmi ceux dispo côté Godot. Contrairement
   * aux noms, pas besoin d'éviter les doublons : deux bots avec le même
   * skin dans une room, ce n'est pas gênant.
   */
  pickBotSkin(): { lobby: string; game: string } {
    return BOT_SKIN_PAIRS[Math.floor(Math.random() * BOT_SKIN_PAIRS.length)];
  }

  /**
   * Retrouve l'équivalent "lobby" (casse attendue par GameRoom.tsx)
   * d'un skin "jeu" (casse attendue par Godot, stockée dans
   * bot.asset). Utilisé par LobbyService au moment d'enregistrer le
   * bot dans Redis pour l'écran d'attente.
   */
  getLobbySkin(gameSkin: string): string {
    const pair = BOT_SKIN_PAIRS.find((p) => p.game === gameSkin);
    return pair?.lobby ?? BOT_SKIN_PAIRS[0].lobby;
  }

  /**
   * Copie exacte du typeChart de combat.service.ts : attaquant -> cible -> multiplicateur.
   * Dupliqué ici volontairement pour ne pas faire dépendre AiService de
   * CombatService juste pour ces quelques valeurs fixes.
   */
  private readonly typeChart: Record<string, Record<string, number>> = {
    fire: { plant: 2, water: 0.5, neutral: 1, earth: 1, fly: 1 },
    water: { fire: 2, plant: 0.5, earth: 0.5, neutral: 1, fly: 1 },
    earth: { water: 2, fire: 0.5, plant: 0.5, neutral: 1, fly: 1 },
    plant: { water: 2, earth: 2, neutral: 1, fire: 0.5, fly: 0.5 },
    neutral: { water: 1, fire: 1, plant: 1, earth: 1, fly: 1 },
    fly: { water: 1, fire: 1, plant: 2, earth: 0.5, neutral: 1 },
  };

  /**
   * Choisit les 3 meilleurs monstres du pool du bot (6 max) contre
   * l'équipe visible de l'adversaire (feature 4a). Chaque monstre du bot
   * reçoit un score = efficacité moyenne de son type contre les types
   * adverses ; on garde les 3 meilleurs.
   */
  chooseBattleTeam(botTeam: string[], enemyTeam: string[]): string[] {
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

  /**
   * Décide de l'action de combat d'un bot pour ce tour (feature 4b).
   * Retourne directement le payload attendu par handleMessage/CombatService.
   *
   * - si le bot n'a pas de monstre actif (début de combat, ou le
   *   précédent vient de mourir) : il en envoie un nouveau
   * - sinon : il attaque avec la meilleure compétence dispo contre le
   *   monstre adverse actuel, ou passe s'il n'a plus rien d'utilisable
   */
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

  /**
   * Décide si le bot doit utiliser un objet plutôt qu'attaquer :
   * - une potion si son monstre actif est sous 50% de PV
   * - une bombe si elle suffit à achever le monstre adverse actuel
   * (rien d'autre : golden ticket et rage ne sont pas gérés par l'IA)
   */
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

  /**
   * Choisit, parmi les monstres vivants du battle_team, celui qui a le
   * meilleur avantage de type contre le monstre adverse actuel. Si
   * l'adversaire n'a pas encore de monstre actif, on prend juste celui
   * avec la meilleure attaque brute.
   */
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

    return bestSlot; // -1 en dernier recours : received_change_current_monster gère déjà ce cas (1er monstre vivant trouvé)
  }

  /**
   * Choisit la compétence de dégâts (avec des PP restants) la plus
   * efficace contre le type du monstre adverse actuel.
   */
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

  /**
   * ID unique pour un bot "hardcoded" (feature 1).
   * Un joueur "takeover" (feature 2) garde son propre id, il n'en a pas besoin.
   */
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
    if (totalRounds <= 0) return 'faible';

    const progress = round / totalRounds; // 0 (1er round) -> 1 (finale)

    if (progress <= 1 / 3) return 'faible';
    if (progress <= 2 / 3) return 'moyen';
    return 'fort';
  }

  /**
   * Tire une équipe au hasard dans le pool du palier donné.
   */
  private pickTeamFromTier(tier: BotTeamTier): readonly string[] {
    const pool = BOT_TEAM_TIERS[tier];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Remplit l'inventaire du bot (potion/bomb) selon le palier du round.
   */
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

  /**
   * Construit un nouveau bot ou transforme un joueur humain déconnecté en bot.
   *
   * - mode 'hardcoded' : nouveau bot créé pour compléter une room qui ne se
   *   remplit pas à temps (feature 1). `team` est pré-rempli avec un palier
   *   de 6 monstres ; `received_team_choice` (map.service.ts) se chargera
   *   plus tard d'aller chercher les vraies stats en DB, exactement comme
   *   pour un joueur humain.
   *
   * - mode 'takeover' : un joueur humain qui se déconnecte en pleine partie
   *   est transformé en bot in-place (feature 2). On mute `isBot = true`
   *   et on lui attribue une équipe + un inventaire du palier du round
   *   courant (feature 3) pour qu'il reste compétitif ; le reste
   *   (battle_team en cours...) n'est pas touché.
   */
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

      // Le joueur peut avoir une équipe faible ou incomplète (peu de
      // monstres attrapés avant la déconnexion). On lui donne une équipe
      // du palier correspondant au round courant pour qu'il reste
      // compétitif pour la suite du bracket. On ne touche pas à
      // battle_team : si un combat est déjà en cours, il continue tel
      // quel, seul le prochain team_setup profitera de la mise à jour.
      humanToReplace.team = [...this.pickTeamFromTier(tier)];
      this.equipBotItems(humanToReplace, tier);

      return humanToReplace;
    }

    const team = this.pickTeamFromTier(tier);
    const id = botId ?? this.generateBotId();
    const skinPair = this.pickBotSkin();

    const bot = new Player(id, botName ?? 'Bot IA', "-1", skinPair.game);
    bot.isBot = true;
    bot.team = [...team];
    this.equipBotItems(bot, tier);

    this.logger.log(
      `[AiService] Instanciation du bot ${id} (round ${round}/${totalRounds}, palier ${tier}, skin ${skinPair.lobby}), équipe: ${team.join(', ')}`,
    );

    return bot;
  }
}