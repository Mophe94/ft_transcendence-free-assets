import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

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
}
