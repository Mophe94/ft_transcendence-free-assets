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
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('Missing JWT');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired JWT');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    this.logger.log('Extracting JWT from cookie...');
    if (request.cookies && request.cookies['access_token']) {
      const token = request.cookies['access_token'] as unknown;
      if (typeof token === 'string') {
        this.logger.log('JWT extracted');
        return token;
      }
    }
    this.logger.error(
      'Failed to extract Cookie: access_token cookie not found or empty.',
    );
    return undefined;
  }
}
