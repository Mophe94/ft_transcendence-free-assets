import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload.interface';
import { IncomingMessage } from 'http';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SharedAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyWsHandshake(
    request: IncomingMessage | undefined,
  ): Promise<JwtPayload> {
    if (!request || !request.headers.cookie) {
      throw new UnauthorizedException('Cookie is missing.');
    }
    const token = this.getCookieValue(request.headers.cookie, 'access_token');
    if (!token) {
      throw new UnauthorizedException('Missing JWT');
    }
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid JWT');
    }
  }

  getCookieValue(
    cookieHeader: string | undefined,
    cookieName: string,
  ): string | undefined {
    if (!cookieHeader) {
      return undefined;
    }

    const prefix = `${cookieName}=`;
    for (const item of cookieHeader.split(';')) {
      const trimmed = item.trim();
      if (trimmed.startsWith(prefix)) {
        return trimmed.slice(prefix.length);
      }
    }

    return undefined;
  }
}
