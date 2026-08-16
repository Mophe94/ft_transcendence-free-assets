import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import { ChatService } from './chat.service';
import type { CheckOnlineUsersDto } from './dto/checkOnlineUsers.dto';
import { ChatGateway } from './chat.gateway';
import { MessageEvent } from './const/messageEvent';
import type { AuthenticatedRequest } from 'libs/shared/src';

@Controller()
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  constructor(
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService,
  ) {}

  @Get('online')
  @UseGuards(JwtHttpGuard)
  getOnlineUsers(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    const onlineUsers = this.chatService.getOnlineUsersIds();

    this.logger.log(
      `[HTTP GET /online] Requested by User: ${user?.username} - Returned ${onlineUsers.length} online user(s)`,
    );

    return onlineUsers;
  }

  @Post('online_users')
  @UseGuards(JwtHttpGuard)
  checkOnlineUsers(
    @Req() req: AuthenticatedRequest,
    @Body() usersDto: CheckOnlineUsersDto,
  ) {
    const user = req.user;
    const users = usersDto.users;
    users.map((user) => {
      user.isOnline = this.chatService.isOnline(user.id);
    });
    this.logger.log(
      `[HTTP POST /online_users] Requested by User: ${user?.id} - Checked ${users.length} user(s)`,
    );
    return { users };
  }

  @Get('/:id/status')
  @UseGuards(JwtHttpGuard)
  getStatus(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const user = req.user;
    const isOnline = this.chatService.isOnline(id);
    this.logger.log(
      `[HTTP GET /:id/status] Requested by User: ${user?.id} - Checked status for Target User: ${id} (Online: ${isOnline})`,
    );

    return { online: isOnline };
  }

  @Post('/send_request_notif')
  sendFriendRequestNotif(
    @Body() body: { senderId: string; destinatoryId: string },
  ) {
    this.logger.log(
      `Receiving request for sending notification: ${body.destinatoryId}`,
    );
    const isSent = this.chatGateway.sendNotifToUser(
      body.destinatoryId,
      MessageEvent.FRIEND_REQUEST,
      { from: body.senderId },
    );

    this.logger.log(
      `[INTERNAL POST /send_request_notif] Friend request notification from Sender: ${body.senderId} -> Target: ${body.destinatoryId} (Delivered: ${isSent})`,
    );
    return { success: true, delivered: isSent };
  }
}
