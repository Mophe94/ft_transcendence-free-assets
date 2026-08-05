import { Injectable, Logger } from '@nestjs/common';
import { Player } from '../player/player';
import { getRandomBotTeam } from './bot-teams.data';

export type BotMode = 'hardcoded' | 'takeover';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private botIdConter = 0;
  
  public generateBotId(): number {
    return --this.botIdConter;
  }
  /**
   * Génère ou transforme un joueur pour l'IA
   */
  public createBotPlayer(
    mode: BotMode = 'hardcoded',
    botId: number = -1,
    humanToReplace?: Player,
  ): Player {
    // CAS 1 : Déconnexion en plein jeu (Takeover)
    if (mode === 'takeover' && humanToReplace) {
      this.logger.log(`[AiService] Transformation du joueur #${humanToReplace.id} en Bot (Déconnexion)`);
      humanToReplace.isBot = true;
      return humanToReplace;
    }

    // CAS 2 : Bot Hardcodé (Timeout Lobby)
    this.logger.log(`[AiService] Instanciation d'un nouveau Bot (ID: ${botId})`);
    
    // Instanciation via le vrai constructeur
    const bot = new Player(botId, 'Bot IA', 'dinoBlue');
    bot.isBot = true;

    // Récupération d'une des 6 équipes au hasard !
    bot.battle_team = getRandomBotTeam();

    // On définit le monstre actif
    bot.currentMonster = bot.battle_team[0];

    return bot;
  }

  
}