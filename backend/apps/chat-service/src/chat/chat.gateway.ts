import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { wsAuthService } from 'libs/shared/src/auth/ws-auth.service';
import { IncomingMessage } from 'http';
import { AuthenticatedSocket } from 'libs/shared/src';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private configService: ConfigService,
    private wsAuthService: wsAuthService,
  ) {}

  // @WebSocketServer()
  // server!: Server;

  // afterInit(server: Server): void {
  //   const frontEndUrl = this.configService.getOrThrow<string>('FRONT_END_URL');

  //   server.engine.opts.cors = {
  //     origin: frontEndUrl,
  //     credentials: true,
  //   };
  // }
  async handleConnection(
    client: AuthenticatedSocket,
    request: IncomingMessage,
  ): Promise<void> {
    try {
      const user = await this.wsAuthService.authenticateClient(client, request);
      client.user = user;
    } catch {
      client.close(1008, 'Unauthorized');
    }
    console.log(`New connection: ${client.user.id}`);
  }

  handleDisconnect(_client: Socket) {
    console.log(`disconnection`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('wtf');
    return 'Hello world!';
  }
}
