import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import type { AuthenticatedRequest } from 'libs/shared/src';

@Controller()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:username')
  @UseGuards(JwtHttpGuard)
  async getProfile(
    @Req() req: AuthenticatedRequest,
    @Param('username') username: string,
  ) {
    const user = await this.usersService.findProfileByUsername(username);
    if (!user) {
      this.logger.warn(
        `[HTTP GET /users/profile/${username} FAILED] User not found (Requested by: ${req?.user?.username || 'unknown'})`,
      );
      throw new NotFoundException('User not found.');
    }

    this.logger.log(
      `[HTTP GET /users/profile/${username} SUCCESS] Profile fetched for ${username} by User: ${req?.user?.username} (${req?.user?.id})`,
    );

    return {
      user: {
        username: user.username,
        email: user.email,
        coalitionId: user.coalitionId,
        createdAt: user.createdAt,
      },
      stats: {
        gamesLost: user.stats ? user.stats.gamesLost : 0,
        gamesWon: user.stats ? user.stats.gamesWon : 0,
        gamesPlayed: user.stats ? user.stats.gamesPlayed : 0,
        achievements: user.stats ? user.stats.Achievements : [],
        nbAchievements: user.stats ? user.stats.NbAchievements : 0,
        monsterDiscovered: user.stats ? user.stats.MonstersDiscovered : [],
        nbMonstersDiscovered: user.stats ? user.stats.NbMonstersDiscovered : 0,
        endingsDiscovered: user.stats ? user.stats.EndingsDiscovered : [],
        nbEndingsDiscovered: user.stats ? user.stats.NbEndingsDiscovered : 0,
        totalPlayerDefeated: user.stats ? user.stats.totalPlayerDefeated : 0,
      },
    };
  }

  @Get('check_username')
  async checkUsername(@Query('username') username: string) {
    if (!username || username.trim().length === 0) {
      this.logger.warn(
        `[HTTP GET /users/check_username FAILED] Missing or empty username parameter`,
      );
      throw new BadRequestException('Invalid parameters.');
    }
    const available = await this.usersService.isUsernameAvailable(username);
    this.logger.log(
      `[HTTP GET /users/check_username] Checked username: "${username}" -> Available: ${available}`,
    );
    return { available };
  }

  @Get('check_email')
  async checkEmail(@Query('email') email: string) {
    if (!email || email.trim().length === 0) {
      this.logger.warn(
        `[HTTP GET /users/check_email FAILED] Missing or empty email parameter`,
      );
      throw new BadRequestException('Invalid parameters.');
    }
    const available = await this.usersService.isEmailAvailable(email);
    this.logger.log(
      `[HTTP GET /users/check_email] Checked email: "${email}" -> Available: ${available}`,
    );
    return { available };
  }
}
