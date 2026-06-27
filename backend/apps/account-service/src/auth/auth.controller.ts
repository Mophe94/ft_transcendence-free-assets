import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import type { AuthenticatedRequest } from 'libs/shared/src';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from 'apps/account-service/src/users/users.service';
import { AdminGuard } from './guards/admin.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signin')
  async signin(
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!code) {
      throw new UnauthorizedException('Code missing');
    }

    const { token, user } = await this.authService.handleFortyTwoAuth(code);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return user;
  }

  @Post('/signout')
  @UseGuards(JwtAuthGuard)
  signout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0,
    });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async whoami(@Req() req: AuthenticatedRequest) {
    const userWithSettings = await this.usersService.findSettingsById(
      req.user.id,
    );

    if (!userWithSettings) {
      throw new NotFoundException('User not found');
    }

    return userWithSettings;
  }

  @Get('/isAdmin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  isAdmin() {
    return { message: 'Welcome to the dashboard.' };
  }
}
