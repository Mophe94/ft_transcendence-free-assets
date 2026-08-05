import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();

    const request = this.extractRequest(context, client);
    const token = this.extractToken(request);

    if (!token) {
      throw new WsException('Jeton JWT absent');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      client.user = payload;
      return true;
    } catch {
      throw new WsException('Jeton JWT invalide ou expiré');
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
