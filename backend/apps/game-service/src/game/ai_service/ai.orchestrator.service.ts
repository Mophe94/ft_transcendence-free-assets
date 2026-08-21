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

  /**
   * Creates `count` "hardcoded" bots (feature 1) to fill up a room, each
   * with a unique name and a team that fits the given round, and
   * registers them with PlayerService (same as a real player would be,
   * via initPlayer/injectPlayer).
   *
   * Does NOT touch any room structure: the caller (GameService) is
   * responsible for adding the returned bots to its own Set/Map.
   */
  async spawnBotsForRoom(
    round: number,
    totalRounds: number,
    count: number,
  ): Promise<Player[]> {
    const usedNames = new Set<string>(); // avoid two bots in the same room getting the same name
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

  /**
   * Turns a disconnected human player into a bot, in place (feature 2).
   * The player keeps their id, inventory, and whatever battle is already
   * in progress — only their team pool gets refreshed to match the
   * current round so they stay competitive (feature 3).
   */
  takeoverPlayer(round: number, totalRounds: number, player: Player, opponent: Player): void {
    if (player.currentPhase == 'map') {
      this.aiService.createBotPlayer('takeover', round, totalRounds, undefined, player);
    }
    else if (player.currentPhase == 'team_choice') {
      if (player.teamReady == true) {
        this.aiService.createBotPlayer('takeover', round, totalRounds, undefined, player);
        return;
      }
      this.decideBattleTeam(this.aiService.createBotPlayer('takeover',round,totalRounds,undefined,player),opponent);
      player.teamReady = true;
    }
    // else if (player.currentPhase == 'combat') {

    // }
  }

  /**
   * Décide de l'équipe de combat (3 monstres) d'un bot pour le
   * team_setup, en fonction de l'équipe visible de l'adversaire.
   */
  decideBattleTeam(bot: Player, enemy: Player): string[] {
    return this.aiService.chooseBattleTeam(bot.team, enemy.team);
  }

  /**
   * Décide de l'action de combat d'un bot pour ce tour.
   */
  decideCombatAction(bot: Player, enemy: Player): GameData {
    return this.aiService.decideCombatAction(bot, enemy);
  }

  /**
   * Retrouve l'équivalent "lobby" (casse React) du skin "jeu" (casse
   * Godot) stocké sur bot.asset. À utiliser quand on enregistre un bot
   * dans Redis pour l'écran d'attente (voir LobbyService).
   */
  getLobbySkin(bot: Player): string {
    return this.aiService.getLobbySkin(bot.asset);
  }
}