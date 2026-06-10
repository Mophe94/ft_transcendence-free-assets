import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'apps/account-service/src/auth/guards/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { AuthService } from 'apps/account-service/src/auth/auth.service';
import { UpdateSettingsDto } from './dtos/update-settingsDto';

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
}
