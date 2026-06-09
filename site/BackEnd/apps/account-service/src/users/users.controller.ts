import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'apps/account-service/src/auth/guards/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile/:username')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Param('username') username: string) {
    const user = await this.usersService.findStatsByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return { user };
  }

  @Get('settings/:username')
  @UseGuards(JwtAuthGuard)
  async getSettings(@Param('username') username: string) {
    const user = await this.usersService.findSettingsByUsername(username);

    if (!user || !user.settings) {
      throw new NotFoundException('Settings not found');
    }
    return { settings: user.settings };
  }
}
