import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import WebSocket from 'ws';
import { AuthenticatedUser } from '../type/authentication.interface';
import { IncomingMessage } from 'http';

@Injectable()
export class wsAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticateClient(
    _client: WebSocket,
    request: IncomingMessage,
  ): Promise<AuthenticatedUser> {
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      return await this.jwtService.verifyAsync<AuthenticatedUser>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromRequest(
    request: IncomingMessage,
  ): string | undefined {
    const rawCookies = request.headers?.cookie;
    if (!rawCookies) {
      return undefined;
    }

    return rawCookies
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('access_token='))
      ?.split('=')[1];
  }
}
