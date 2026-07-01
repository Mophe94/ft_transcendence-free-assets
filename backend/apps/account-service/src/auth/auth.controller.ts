import {
  Body,
  Controller,
  ForbiddenException,
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
import { UserRole } from '../users/types/userRole.enum';

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
  @UseGuards(JwtAuthGuard)
  async isAdmin(@Req() req: AuthenticatedRequest) {
    const user = req.user;

    if (!user) throw new ForbiddenException('User not Authenticated.');
    else if (user.role !== UserRole.ADMIN)
      throw new ForbiddenException('User is not Admin');

    const db_user = await this.usersService.findOneById(user.id);
    if (!db_user) throw new ForbiddenException('User not found in database.');
    else if (db_user.role !== UserRole.ADMIN)
      throw new ForbiddenException('User is not Admin.');
    return { isAdmin: true };
  }
}
