import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:username')
  @UseGuards(JwtHttpGuard)
  async getProfile(@Param('username') username: string) {
    const user = await this.usersService.findProfileByUsername(username);
    if (!user) throw new NotFoundException('User not found.');
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
        nbObjectsDiscovered: user.stats.nbObjectsDiscovered,
        totalDamageDealt: user.stats.totalDamageDealt,
        totalDamageReceived: user.stats.totalDamageReceived,
      },
    };
  }

  @Get('check_username')
  async checkUsername(@Query('username') username: string) {
    if (!username || username.trim().length === 0) {
      throw new BadRequestException('Invalid parameters.');
    }
    const available = await this.usersService.isUsernameAvailable(username);
    return available;
  }

  @Get('check_email')
  async checkEmail(@Query('email') email: string) {
    if (!email || email.trim().length === 0) {
      throw new BadRequestException('Invalid parameters.');
    }
    const available = await this.usersService.isEmailAvailable(email);
    return available;
  }
}
