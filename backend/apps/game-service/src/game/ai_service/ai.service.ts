import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Player } from '../player/player';
import { BOT_TEAM_TIERS, BOT_NAMES } from './bot.data';

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
   * ID unique pour un bot "hardcoded" (feature 1).
   * Un joueur "takeover" (feature 2) garde son propre id, il n'en a pas besoin.
   */
  generateBotId(): string {
    return `bot-${randomUUID()}`;
  }

  /**
   * Choisit le pool d'équipes correspondant à l'avancement dans le bracket.
   *
   * @param round        Round courant du bracket (1-indexed)
   * @param totalRounds  Nombre total de rounds du bracket (Math.log2(FULL))
   */
  private pickPoolForRound(round: number, totalRounds: number): readonly (readonly string[])[] {
    if (totalRounds <= 0) return BOT_TEAM_TIERS.faible;

    const progress = round / totalRounds; // 0 (1er round) -> 1 (finale)

    if (progress <= 1 / 3) return BOT_TEAM_TIERS.faible;
    if (progress <= 2 / 3) return BOT_TEAM_TIERS.moyen;
    return BOT_TEAM_TIERS.fort;
  }

  /**
   * Tire une équipe au hasard dans le pool du palier concerné.
   */
  private pickTeamForRound(round: number, totalRounds: number): readonly string[] {
    const pool = this.pickPoolForRound(round, totalRounds);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Construit un nouveau bot ou transforme un joueur humain déconnecté en bot.
   *
   * - mode 'hardcoded' : nouveau bot créé pour compléter une room qui ne se
   *   remplit pas à temps (feature 1). `team` est pré-rempli avec un palier
   *   de 3 monstres ; `received_team_choice` (map.service.ts) se chargera
   *   plus tard d'aller chercher les vraies stats en DB, exactement comme
   *   pour un joueur humain.
   *
   * - mode 'takeover' : un joueur humain qui se déconnecte en pleine partie
   *   est transformé en bot in-place (feature 2). On mute `isBot = true`
   *   et on lui attribue une équipe du palier du round courant (feature 3)
   *   pour qu'il reste compétitif ; le reste (battle_team en cours,
   *   inventaire...) n'est pas touché.
   */
  createBotPlayer(
    mode: BotMode,
    round: number,
    totalRounds: number,
    botId?: string,
    humanToReplace?: Player,
    botName?: string,
  ): Player {
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
      const team = this.pickTeamForRound(round, totalRounds);
      humanToReplace.team = [...team];

      return humanToReplace;
    }

    const team = this.pickTeamForRound(round, totalRounds);
    const id = botId ?? this.generateBotId();

    this.logger.log(
      `[AiService] Instanciation du bot ${id} (round ${round}/${totalRounds}), équipe: ${team.join(', ')}`,
    );

    const bot = new Player(id, botName ?? 'Bot IA', 'dinoBlue');
    bot.isBot = true;
    bot.team = [...team];

    return bot;
  }
}