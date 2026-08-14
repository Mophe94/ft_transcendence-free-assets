import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import { ChatService } from './chat.service';
import type { CheckOnlineUsersDto } from './dto/checkOnlineUsers.dto';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/online')
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
}
