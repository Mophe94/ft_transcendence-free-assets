import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { UserSettings } from '../users/types/userSettings.interface';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findSettingsById(id: string): Promise<UserSettings | null> {
    const user = await this.repo.findOne({
      where: { id },
      select: { settings: true },
    });
    return user?.settings ?? null;
  }

  async updateSettings(
    id: string,
    newSettings: Partial<UserSettings>,
  ): Promise<Partial<User>> {
    const result = await this.repo
      .createQueryBuilder()
      .update(User)
      .set({
        settings: () => `settings || '${JSON.stringify(newSettings)}'::jsonb`,
      })
      .where('id = :id', { id })
      .returning(['settings', 'updatedAt'])
      .execute();

    console.log("result", result)
    if (!result.affected) {
      throw new NotFoundException('Invalid User');
    }
    console.log("affected", result.affected)
    const rawList = result.raw as Partial<User>[];
    if (!rawList.length) {
      throw new NotFoundException('User not found');
    }

    const updatedRaw = rawList[0];

    return {
      settings: updatedRaw.settings,
      updatedAt: updatedRaw.updated_at,
    };
  }
}
