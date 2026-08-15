import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from 'libs/shared/src';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import { SettingsService } from './settings.service';
import type { UserSettings } from '../users/types/userSettings.interface';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @UseGuards(JwtHttpGuard)
  async getUserSettings(@Req() req: AuthenticatedRequest) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('Missing JWT');
    }
    const settings =
      (await this.settingsService.findSettingsById(req.user.id)) ?? null;
    console.log(settings);
    return settings;
  }

  @Patch('update')
  @UseGuards(JwtHttpGuard)
  async updateUserSettings(
    @Req() req: AuthenticatedRequest,
    @Body() settings: UserSettings,
  ) {
    if (!req.user || !req.user.id || !settings) {
      throw new UnauthorizedException('Missing JWT');
    }

    const updatedSettings = await this.settingsService.updateSettings(
      req.user.id,
      settings,
    );
    console.log(updatedSettings);

    return settings;
  }
}
