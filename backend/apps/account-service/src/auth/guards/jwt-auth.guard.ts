import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedRequest, AuthenticatedUser } from 'libs/shared/src';
import { Socket } from 'socket.io';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }
    try {
      const payload = await this.jwtService.verifyAsync<AuthenticatedRequest>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if (request.cookies && request.cookies['access_token']) {
      const token = request.cookies['access_token'] as unknown;
      if (typeof token === 'string') {
        return token;
      }
    }
    return undefined;
  }
  private extractTokenFromWsClient(client: Socket): string | undefined {
    const rawCookies = client.handshake?.headers?.cookie;

    if (!rawCookies) {
      return undefined;
    }
    const tokenCookie = rawCookies
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('access_token='));

    if (!tokenCookie) {
      return undefined;
    }

    const token = tokenCookie.split('=')[1];
    return token || undefined;
  }
}
