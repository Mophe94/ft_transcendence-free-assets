import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../../types/jwt-payload.interface';

@Injectable()
export class JwtHttpGuard implements CanActivate {
  private readonly logger = new Logger(JwtHttpGuard.name);
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip } = request;
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      this.logger.warn(
        `[AUTH FAIL] ${method} ${url} - IP: ${ip} - Missing or invalid token. Request Aborted.`,
      );
      throw new UnauthorizedException('Missing JWT');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
      this.logger.log(
        `[AUTH SUCCESS] ${method} ${url} - User: ${payload.id} - IP: ${ip}`,
      );
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired JWT');
    }
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
}
