import {
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Ip() ip: string,
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.createUser(userDto);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      this.logger.log(
        `[HTTP POST /auth/signup SUCCESS] User registered: ${user.username} (${user.id}) - IP: ${ip}`,
      );
      return user;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `[HTTP POST /auth/signup FAILED] Email/Username: ${userDto.email} - Reason: ${reason} - IP: ${ip}`,
      );
      throw error;
    }
  }

  @Post('signin')
  async authenticate(
    @Ip() ip: string,
    @Body() { email, password }: UserCredentials,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.validateUserCredentials(
        email,
        password,
      );

      if (!user || !token) {
        this.logger.warn(
          `[HTTP POST /auth/signin FAILED] Invalid credentials for Email: ${email} - IP: ${ip}`,
        );
        throw new NotFoundException('Invalid credentials');
      }
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      this.logger.log(
        `[HTTP POST /auth/signin SUCCESS] User authenticated: ${user.username} (${user.id}) - IP: ${ip}`,
      );
      return user;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `[HTTP POST /auth/signin ERROR] Email: ${email} - Reason: ${reason} - IP: ${ip}`,
        );
      }
      throw error;
    }
  }

  @Post('/signin_42')
  async signinFortyTwo(
    @Ip() ip: string,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!code) {
      this.logger.warn(
        `[HTTP POST /auth/signin_42 FAILED] Missing authorization code - IP: ${ip}`,
      );
      throw new UnauthorizedException('Code missing');
    }
    try {
      const { token, user } = await this.authService.handleFortyTwoAuth(code);
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });
      this.logger.log(
        `[HTTP POST /auth/signin_42 SUCCESS] 42 Auth succeeded for User: ${user?.username} (${user?.id}) - IP: ${ip}`,
      );

      return user;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `[HTTP POST /auth/signin_42 FAILED] 42 OAuth exchange failed - Reason: ${reason} - IP: ${ip}`,
      );
      throw error;
    }
  }

  @Post('/signout')
  @UseGuards(JwtHttpGuard)
  signout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;

    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0,
    });
    this.logger.log(
      `[HTTP POST /auth/signout] User signed out: ${user?.username || 'unknown'} (${user?.id})`,
    );
  }

  @Get('me')
  @UseGuards(JwtHttpGuard)
  whoAmI(@Req() req: AuthenticatedRequest) {
    const user = req.user;

    this.logger.log(
      `[HTTP GET /auth/me] Profile retrieved for User: ${user?.username} (${user?.id})`,
    );
    return {
      user: req.user?.id,
      email: req.user?.email,
      username: req.user?.username,
      avatarUrl: req.user?.avatarUrl,
    };
  }
}
