import { Controller, Patch, Param, Body } from '@nestjs/common';
import { UserStatService } from './stats.services';
import { UpdateAllStatsDto } from './dto/update-all-stats.dto';

@Controller('stats')
export class UserStatsController {
  constructor(private readonly userStatService: UserStatService) {}

  @Patch(':userId')
  async updateAll(
    @Param('userId') userId: string,
    @Body() dto: UpdateAllStatsDto,
  ): Promise<void> {
    await this.userStatService.allUpdate(
      userId,
      dto.monsterCatch,
      dto.win,
      dto.lose,
      dto.playerDefeated,
      dto.asset,
    );
  }
}
