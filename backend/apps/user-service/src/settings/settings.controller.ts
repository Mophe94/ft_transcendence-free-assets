import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from 'libs/shared/src';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import { SettingsService } from './settings.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtHttpGuard)
  async getUserSettings(@Req() req: AuthenticatedRequest) {
    if (!req?.user?.id) {
      this.logger.warn('[GET /settings] Unauthorized access attempt');
      throw new UnauthorizedException('Missing JWT');
    }
    const userId = req.user.id;
    const settings =
      (await this.settingsService.findSettingsById(userId)) ?? null;
    this.logger.log(`[GET /settings] Retrieved settings for user ${userId}`);
    return settings;
  }

  @Patch('update')
  @UseGuards(JwtHttpGuard)
  async updateUserSettings(
    @Req() req: AuthenticatedRequest,
    @Body() updateSettingsDto: UpdateUserSettingsDto,
  ) {
    if (!req?.user?.id) {
      this.logger.warn('[PATCH /update] Unauthorized access attempt');
      throw new UnauthorizedException('Missing JWT');
    }

    const userId = req.user.id;
    const updatedSettings = await this.settingsService.updateSettings(
      userId,
      updateSettingsDto,
    );
    this.logger.log(`[PATCH /update] Updated settings for user ${userId}`);

    return updatedSettings;
  }
}
