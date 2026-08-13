import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SendFriendRequestDto } from './dto/sendFriendRequest.dto';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import type { AuthenticatedRequest } from 'libs/shared/src';
import { UsersService } from '../users/users.service';
import { SocialService } from './socials.service';
import { CheckOnlineUsersDto } from 'apps/chat-service/src/chat/dto/checkOnlineUsers.dto';

@Controller('friends')
export class SocialsController {
  constructor(
    private readonly socialsService: SocialService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtHttpGuard)
  async getFriends(
    @Req() req: AuthenticatedRequest,
  ): Promise<CheckOnlineUsersDto> {
    if (!req?.user?.id) throw new UnauthorizedException('Unauthorized call');
    const friends = await this.socialsService.retrieveFriends(req.user.id);
    const chatService =
      process.env.CHAT_SERVICE_URL || 'http://chat_service:3000';

    const cookieHeader = req.headers['cookie'] as string | undefined;
    try {
      console.log("before fetch");
      const response = await fetch(`${chatService}/online_users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ users: friends }),
      });
      console.log("after fetch");
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Message renvoyé par chat_service :", errorText);
        throw new UnauthorizedException('Chat service is not responding');
      }
      const onlineUsers = (await response.json()) as CheckOnlineUsersDto;
      return onlineUsers;
    } catch {
      console.log('error');
      throw new InternalServerErrorException(
        'Failed to communicate with chatService',
      );
    }
  }

  @Get('pending_requests')
  @UseGuards(JwtHttpGuard)
  async getPendingRequest(@Req() req: AuthenticatedRequest) {
    if (!req.user?.id) throw new UnauthorizedException('Unauthorized call');

    return await this.socialsService.getReceivedRequest(req.user.id);
  }

  @Post('send_request')
  @UseGuards(JwtHttpGuard)
  async SendFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    console.log(sendFriendRequestDto);
    if (!req?.user?.id) throw new UnauthorizedException('Unauthorized call');

    const sender = await this.usersService.findById(req.user.id);
    if (!sender) throw new UnauthorizedException('Unauthorized call');

    const destinatory = await this.usersService.findByIdentifier(
      sendFriendRequestDto.destinatory,
    );

    if (!destinatory) throw new UnauthorizedException('Invalid destinatory');

    const existingRelation = await this.socialsService.checkExistingRequest(
      sender.id,
      destinatory.id,
    );

    if (existingRelation) {
      throw new UnauthorizedException('Request already existing');
    }
    return await this.socialsService.createRequest(sender.id, destinatory.id);
  }

  @Patch('accept/:id')
  @UseGuards(JwtHttpGuard)
  async acceptRequest(
    @Req() req: AuthenticatedRequest,
    @Param('id') requesterId: string,
  ) {
    if (!req?.user?.id) throw new UnauthorizedException('Unauthorized call');
    return await this.socialsService.acceptFriendRequest(
      requesterId,
      req.user.id,
    );
  }

  @Delete('remove_relation/:id')
  @UseGuards(JwtHttpGuard)
  async removeRelationship(
    @Req() req: AuthenticatedRequest,
    @Param('id') requesterId: string,
  ) {
    console.log('Hello');
    if (!req?.user?.id) throw new UnauthorizedException('Unauthorized call');
    return await this.socialsService.deleteFriendRequest(
      req.user.id,
      requesterId,
    );
  }
}
