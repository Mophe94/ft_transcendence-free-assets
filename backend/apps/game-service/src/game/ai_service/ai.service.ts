import { Injectable, Logger } from '@nestjs/common';
import { Player } from '../player/player';
import { getRandomBotTeam } from './bot-teams.data';
import { MonstersService } from '../entities/monsters.service'; 
import { CombatService } from '../combat.service'; 
import { CurrentMonster,CurrentActions } from '../player/player.interfaces';

export type BotMode = 'hardcoded' | 'takeover';

const BOT_SKINS = [
  'dinoBlue', 'dinoYellow', 'dinoGreen', 'dinoRed',
  'ghost', 'ghost02', 'ghost03', 'satyr01', 'satyr02', 'satyr03',
];

function getRandomBotSkin(): string {
  return BOT_SKINS[Math.floor(Math.random() * BOT_SKINS.length)];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private botIdConter = -1000;

  constructor(
    private readonly monstersService: MonstersService,
    private readonly combatService: CombatService, // réutilise la table existante
  ) {}

  public generateBotId(): number {
    return --this.botIdConter;
  }

  public createBotPlayer(
    mode: BotMode = 'hardcoded',
    botId: number = -1,
    humanToReplace?: Player,
  ): Player {
    if (mode === 'takeover' && humanToReplace) {
      this.logger.log(`[AiService] Transformation du joueur #${humanToReplace.id} en Bot (Déconnexion)`);
      humanToReplace.isBot = true;
      return humanToReplace;
    }

    this.logger.log(`[AiService] Instanciation d'un nouveau Bot (ID: ${botId})`);

    const bot = new Player(botId, 'Bot IA', getRandomBotSkin());
    bot.isBot = true;

    bot.battle_team = getRandomBotTeam(); // pool de 6, temporaire
    const names = bot.battle_team.map((m) => m.name).filter((n) => n !== '');
    bot.team = [...names, '', '', '', '', ''].slice(0, 6);

    return bot;
  }

  /**
   * Choisit les 3 meilleurs monstres du pool (6, depuis bot-teams.data.ts)
   * pour contrer le roster adverse (6 noms, connus dès le début du team_setup).
   */
  public async chooseCounterTeam(
    pool: CurrentMonster[],
    opponentNames: string[],
  ): Promise<CurrentMonster[]> {
    const opponentTypes = await this.resolveOpponentTypes(opponentNames);

    const scored = pool
      .filter((m) => m.name !== '')
      .map((m) => ({
        monster: m,
        score: this.scoreAgainstTypes(m.type, opponentTypes),
      }));

    scored.sort((a, b) => b.score - a.score);

    console.log('\n================= AI COUNTER-PICK SCORING =================');
    console.table(scored.map(({ monster, score }) => ({ name: monster.name, type: monster.type, score })));
    console.log(`Adversaire (types): [${opponentTypes.join(', ')}]`);
    console.log('==============================================================\n');

    return scored.slice(0, 3).map((s, idx) => ({ ...s.monster, slot: idx }));
  }

    /**
   * Variante de chooseCounterTeam pour un takeover : le roster vient du vrai
   * `player.team` (noms capturés en jeu), pas du preset bot-teams.data.ts.
   * Retourne 3 noms, à passer tels quels à received_team_choice().
   */
  public async chooseCounterTeamByNames(
    rosterNames: string[],
    opponentNames: string[],
  ): Promise<string[]> {
    const roster = await this.resolveRosterWithTypes(rosterNames);
    const opponentTypes = await this.resolveOpponentTypes(opponentNames);

    const scored = roster.map((m) => ({
      name: m.name,
      type: m.type,
      score: this.scoreAgainstTypes(m.type, opponentTypes),
    }));

    scored.sort((a, b) => b.score - a.score);

    console.log('\n================= AI COUNTER-PICK SCORING (takeover) =================');
    console.table(scored);
    console.log(`Adversaire (types): [${opponentTypes.join(', ')}]`);
    console.log('=========================================================================\n');

    return scored.slice(0, 3).map((s) => s.name);
  }

  private async resolveRosterWithTypes(names: string[]): Promise<{ name: string; type: string }[]> {
    const result: { name: string; type: string }[] = [];
    for (const name of names) {
      if (name === '') continue;
      const monster = await this.monstersService.findOneByName(name);
      if (monster) result.push({ name: monster.name, type: String(monster.type) });
    }
    return result;
  }
  
  private scoreAgainstTypes(monsterType: string, opponentTypes: string[]): number {
    let score = 0;
    for (const oppType of opponentTypes) {
      score += this.combatService.getEffectiveness(monsterType, oppType); // dégâts qu'il inflige
      score -= this.combatService.getEffectiveness(oppType, monsterType); // dégâts qu'il encaisse
    }
    return score;
  }

  private async resolveOpponentTypes(names: string[]): Promise<string[]> {
    const types: string[] = [];
    for (const name of names) {
      if (name === '') continue;
      const monster = await this.monstersService.findOneByName(name);
      if (monster) types.push(String(monster.type));
    }
    return types;
  }

  public decideAction(bot: Player, opponent: Player): CurrentActions {
    const monster = bot.currentMonster;

    // Pas de monstre actif (début de combat ou monstre KO) -> en choisir un
    if (!monster || monster.name === '' || monster.life.current <= 0) {
      const slot = bot.battle_team.findIndex((m) => m.name !== '' && m.life.current > 0);
      if (slot !== -1) {
        return { actionType: 'change_current_monster', data: { slot } };
      }
      return { actionType: 'pass', data: undefined };
    }

    const availableSkill = monster.skill.find((s) => s.name !== '' && s.current > 0);
    if (availableSkill) {
      return { actionType: 'try_attack', data: { skill: availableSkill.name } };
    }
    return { actionType: 'pass', data: undefined };
  }
}