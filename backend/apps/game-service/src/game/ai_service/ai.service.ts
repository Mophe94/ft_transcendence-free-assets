import { Injectable, Logger } from '@nestjs/common';
import { Player } from '../player/player';

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

    // Remplissage d'un monstre de test dans son équipe (slot 0)
    bot.battle_team[0] = {
      name: 'Pisciner Bot',
      slot: 0,
      type: 'Water',
      life: { current: 100, max: 100 },
      status: [],
      skill: [
        { name: 'Pistolet Eau', current: 10, max: 10, type: 'Water' },
        { name: 'Charge', current: 15, max: 15, type: 'Normal' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    };

    // On définit le monstre actif
    bot.currentMonster = bot.battle_team[0];

    return bot;
  }

  
}