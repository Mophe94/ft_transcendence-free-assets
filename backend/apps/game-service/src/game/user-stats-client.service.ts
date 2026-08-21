import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface UpdateAllStatsPayload {
  monsterCatch: string[];
  win: boolean;
  lose: boolean;
  playerDefeated: number;
  asset: string;
}

@Injectable()
export class UserStatsClientService {
  private readonly logger = new Logger(UserStatsClientService.name);
  private readonly baseUrl = process.env.USERS_SERVICE_URL ?? 'http://users_service:3000';

  constructor(private readonly httpService: HttpService) {}

  async allUpdate(userId: string, payload: UpdateAllStatsPayload): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.patch(`${this.baseUrl}/stats/${userId}`, payload),
      );
    } catch (err) {
      this.logger.error(`Failed to update stats for user ${userId}`, err);
    }
  }
}