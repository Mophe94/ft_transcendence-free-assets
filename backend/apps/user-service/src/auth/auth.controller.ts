import { Body, Controller, Get, NotFoundException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import type { AuthenticatedRequest } from 'libs/shared/src/types/authentication.interface';

interface UserCredentials {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.createUser(userDto);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return user;
  }

  @Post('signin')
  async authenticate(
    @Body() { email, password }: UserCredentials,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.authService.validateUserCredentials(
      email,
      password,
    );

    if (!user || !token) throw new NotFoundException("Invalid credentials");
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return user;
  }

  @Get('me')
  @UseGuards(JwtHttpGuard)
  whoAmI(@Req() req: AuthenticatedRequest) {
    return {
      user: req.user?.sub,
      email: req.user?.email,
      username: req.user?.username,
      avatarUrl: req.user?.avatarUrl,
    };
  }
}
