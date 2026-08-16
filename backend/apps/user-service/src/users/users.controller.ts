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
        gamesLost: user.stats.gamesLost,
        gamesWon: user.stats.gamesWon,
        gamesPlayed: user.stats.gamesPlayed,
        nbAchievements: user.stats.nbAchievements,
        nbMonstersDiscovered: user.stats.nbMonstersDiscovered,
        nbObjectsDiscovered: user.stats.nbEndingsDiscovered,
        totalPlayerDefeated: user.stats.totalPlayersDefeated,
        // totalDamageReceived: user.stats.totalDamageReceived,
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
