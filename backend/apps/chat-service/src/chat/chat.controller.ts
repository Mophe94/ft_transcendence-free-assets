import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import { ChatService } from './chat.service';
import type { CheckOnlineUsersDto } from './dto/checkOnlineUsers.dto';
import { ChatGateway } from './chat.gateway';
import { MessageEvent } from './const/messageEvent';

@Controller()
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService,
  ) {}

  @Get('online')
  @UseGuards(JwtHttpGuard)
  getOnlineUsers() {
    return this.chatService.getOnlineUsersIds();
  }

  @Post('online_users')
  @UseGuards(JwtHttpGuard)
  checkOnlineUsers(@Body() usersDto: CheckOnlineUsersDto) {
    const users = usersDto.users;
    users.map((user) => {
      user.isOnline = this.chatService.isOnline(user.id);
    });
    return { users };
  }

  @Get('/:id/status')
  getStatus(@Param('id') id: string) {
    return { online: this.chatService.isOnline(id) };
  }

  @Post('/send_request_notif')
  sendFriendRequestNotif(
    @Body() body: { senderId: string; destinatoryId: string },
  ) {
    console.log(body);
    this.logger.log(
      `Receiving request for sending notification: ${body.destinatoryId}`,
    );
    const isSent = this.chatGateway.sendNotifToUser(
      body.destinatoryId,
      MessageEvent.FRIEND_REQUEST,
      { from: body.senderId },
    );
    return { success: true, delivered: isSent };
  }
}
