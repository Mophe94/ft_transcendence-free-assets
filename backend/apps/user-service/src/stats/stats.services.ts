import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStats } from './stats.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserStatService {
  constructor(
    @InjectRepository(UserStats)
    private userStatsRepository: Repository<UserStats>,
  ) {}

  /************************ WIN ************************/
  async newWin(userId: string): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    stats.gamesWon += 1;
    await this.userStatsRepository.save(stats);
  }

  async getWin(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.gamesWon;
  }

  /************************ LOST ************************/
  async newLost(userId: string): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    stats.gamesLost += 1;
    await this.userStatsRepository.save(stats);
  }

  async getLost(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.gamesLost;
  }

  /************************ PLAYED ************************/
  async newGamePlayed(userId: string): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    stats.gamesPlayed += 1;
    await this.userStatsRepository.save(stats);
  }

  async getGamePlayed(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.gamesPlayed;
  }

  /************************ TOTAL PLAYERS DEFEATED ************************/
  async addPlayerDefeated(userId: string, nbPlayers: number): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    stats.totalPlayerDefeated += nbPlayers;
    await this.userStatsRepository.save(stats);
  }

  async getPlayerDefeated(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.totalPlayerDefeated;
  }

  /************************ Catch Monsters ************************/
  async newMonsterCatch(userId: string, monsterArray: string[]): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    let hasChanged = false;

    for (const monster of monsterArray) {
      if (!stats.MonstersDiscovered.includes(monster)) {
        stats.MonstersDiscovered.push(monster);
        stats.NbMonstersDiscovered += 1;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      await this.userStatsRepository.save(stats);
    }
  }

  async getMonsterCatch(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.MonstersDiscovered.length;
  }

  async getNbMonsterCatch(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.NbMonstersDiscovered;
  }

  /************************ Ending ************************/
  async newEnding(userId: string, assetEnding: string): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    let hasChanged = false;

    if (!stats.EndingsDiscovered.includes(assetEnding)) {
      stats.EndingsDiscovered.push(assetEnding);
      stats.NbEndingsDiscovered += 1;
      hasChanged = true;
    }

    if (hasChanged) {
      await this.userStatsRepository.save(stats);
    }
  }

  async getEnding(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.EndingsDiscovered.length;
  }

  async getNbEnding(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.NbEndingsDiscovered;
  }

  /************************ Achivements ************************/
  async newAchievement(userId: string, achievement: string): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    let hasChanged = false;

    if (!stats.Achievements.includes(achievement)) {
      stats.Achievements.push(achievement);
      stats.NbAchievements += 1;
      hasChanged = true;
    }

    if (hasChanged) {
      await this.userStatsRepository.save(stats);
    }
  }

  async getAchivements(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.Achievements.length;
  }

  async getNbAchivements(userId: string): Promise<number> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.NbAchievements;
  }

  /************************ Update ************************/
  async updateStat(userId: string, achievement: string): Promise<void> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });

    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    stats.updatedAt = new Date();
    await this.userStatsRepository.save(stats);
  }

  async getUpdateStat(userId: string): Promise<Date> {
    const stats = await this.userStatsRepository.findOne({ where: { userId } });
    if (!stats) {
      throw new Error(`No stat found for ${userId}`);
    }

    return stats.updatedAt;
  }
}
