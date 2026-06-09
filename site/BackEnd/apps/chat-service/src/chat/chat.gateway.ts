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

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private configService: ConfigService) {}

  @WebSocketServer()
  server!: Server;

  afterInit(server: Server): void {
    const frontEndUrl = this.configService.getOrThrow<string>('FRONT_END_URL');

    server.engine.opts.cors = {
      origin: frontEndUrl,
      credentials: true,
    };
  }
  handleConnection(client: Socket): void {
    console.log(`New connection: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`disconnection: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
