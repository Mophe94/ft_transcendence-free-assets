import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import * as url from 'url';
import { WebSocket } from 'ws';
import { JwtPayload } from '../../types/jwt-payload.interface';

export interface AuthenticatedSocket extends WebSocket {
  user?: JwtPayload;
}

@Injectable()
export class JwtWsGuard implements CanActivate {
  private readonly logger = new Logger(JwtWsGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();

    this.logger.log('Extracting request...');
    const request = this.extractRequest(context, client);
    this.logger.log('Extracting token...');
    const token = this.extractToken(request);

    if (!token) {
      this.logger.error('Missing JWT.');
      throw new WsException('Missing JWT');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      client.user = payload;
      return true;
    } catch {
      this.logger.error('Invalid JWT or expired');
      throw new WsException('Invalid JWT or expired');
    }
  }

  private extractRequest(
    context: ExecutionContext,
    client: AuthenticatedSocket,
  ): IncomingMessage | undefined {
    const wsData = context.switchToWs().getData<{ req?: IncomingMessage }>();

    if (
      'upgradeReq' in client &&
      client.upgradeReq instanceof IncomingMessage
    ) {
      return client.upgradeReq;
    }

    if (
      wsData &&
      typeof wsData === 'object' &&
      wsData.req instanceof IncomingMessage
    ) {
      return wsData.req;
    }

    return undefined;
  }

  private extractToken(
    request: IncomingMessage | undefined,
  ): string | undefined {
    if (!request) {
      return undefined;
    }

    if (typeof request.url === 'string') {
      const parsedUrl = url.parse(request.url, true);
      const tokenQuery = parsedUrl.query.token;
      if (typeof tokenQuery === 'string') {
        return tokenQuery;
      }
    }

    const authHeader = request.headers.authorization;
    if (typeof authHeader === 'string') {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
      }
    }

    return undefined;
  }
}
