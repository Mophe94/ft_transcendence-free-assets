import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import type { AuthenticatedRequest } from './types/auth-request.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
      secure: false, // change to true for prod !!!!!!!! for HTTPS
      sameSite: 'lax', // Protects against CSRF attack
      maxAge: 24 * 60 * 60 * 1000,
    });
    return user;
  }

  @Post('/signout')
  @UseGuards(JwtAuthGuard)
  signout(@Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: false, // change to true for prod !!!!!!!! for HTTPS
      sameSite: 'lax',
      maxAge: 0,
    });
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  whoami(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}
