import { InjectRepository } from '@nestjs/typeorm';
import { Settings } from './settings.entity';
import { Repository } from 'typeorm';

export class SettingsService {
  constructor(@InjectRepository(Settings) private repo: Repository<Settings>) {}

  async changeSettings(id: number, updatedSettings: Partial<Settings>) {
    await this.repo.update(id, updatedSettings);
    return this.repo.findOneBy({ id });
  }
}
