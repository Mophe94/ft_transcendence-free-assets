import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { PlayerService } from '../player/player.service';
import { Player } from '../player/player';
import { GameData } from '../game.type';
/**
 * Single entry point between GameService and everything related to AI.
 * GameService stays in charge of room management (the userId Set/Map);
 * this class only creates and registers the bots themselves, so
 * game.service.ts doesn't need to know how a bot is built (team, name,
 * id...).
 */
@Injectable()
export class AiOrchestratorService {
  constructor(
    private aiService: AiService,
    private playerService: PlayerService,
  ) {}

  async spawnBotsForRoom(
    round: number,
    totalRounds: number,
    count: number,
  ): Promise<Player[]> {
    const usedNames = new Set<string>();
    const bots: Player[] = [];

    for (let i = 0; i < count; i++) {
      const botId = this.aiService.generateBotId();
      const botName = this.aiService.pickBotName(usedNames);
      const bot = this.aiService.createBotPlayer(
        'hardcoded',
        round,
        totalRounds,
        botId,
        undefined,
        botName,
      );
      bot.roundsRemaining = totalRounds;

      this.playerService.injectPlayer(botId, bot);
      bots.push(bot);
    }

    return bots;
  }

  takeoverPlayer(round: number, totalRounds: number, player: Player, opponent: Player): void {
    this.aiService.createBotPlayer('takeover', round, totalRounds, undefined, player);
  }

  decideBattleTeam(bot: Player, enemy: Player): string[] {
    return this.aiService.chooseBattleTeam(bot.team, enemy.team);
  }

  decideCombatAction(bot: Player, enemy: Player): GameData {
    return this.aiService.decideCombatAction(bot, enemy);
  }

  getLobbySkin(bot: Player): string {
    return this.aiService.getLobbySkin(bot.asset);
  }

  refreshBotForRound(bot: Player, round: number, totalRounds: number): void {
  if (!bot.isBot) return;
  this.aiService.refreshBotLoadout(bot, round, totalRounds);
  }
}