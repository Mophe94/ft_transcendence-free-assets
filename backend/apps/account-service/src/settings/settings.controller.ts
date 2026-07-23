import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'apps/account-service/src/auth/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { AuthService } from 'apps/account-service/src/auth/auth.service';
import { UpdateSettingsDto } from './dtos/update-settingsDto';
import type { AuthenticatedRequest } from 'libs/shared/src';

@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
  ) {}

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  async updateSettings(@Body('settings') settings: UpdateSettingsDto) {
    console.log(' ==> ', settings);
    const updatedSettings = await this.settingsService.changeSettings(
      settings.id,
      settings,
    );

    if (!updatedSettings) {
      throw new NotFoundException('Invalid request');
    }

    return {
      settings: updatedSettings,
    };
  }
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getSettings(@Req() req: AuthenticatedRequest) {
    console.log("JPP");
    const { id } = req.user;
    const settings = await this.settingsService.findSettingsByUserId(id);

    if (!settings) {
      throw new NotFoundException('Settings not found');
    }
    return { settings: settings };
  }
}
