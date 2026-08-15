import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(SocialsController.name);
  constructor(
    private readonly socialsService: SocialService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtHttpGuard)
  async getFriends(
    @Req() req: AuthenticatedRequest,
  ): Promise<CheckOnlineUsersDto> {
    this.logger.log('/getFriends request');
    if (!req?.user?.id) throw new UnauthorizedException('Unauthorized call');
    this.logger.log(`Requesting user : ${req.user.username}`);
    const friends = await this.socialsService.retrieveFriends(req.user.id);
    const chatService = 'http://chat_service:3000';

    const cookieHeader = req.headers['cookie'] as string | undefined;
    try {
      const response = await fetch(`${chatService}/online_users`, {
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ users: friends }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Error while contacting chatService: ${errorText}`);
        throw new UnauthorizedException('Chat service is not responding');
      }
      const onlineUsers = (await response.json()) as CheckOnlineUsersDto;
      this.logger.log('Managed to retrieved friends. Sending response.');
      return onlineUsers;
    } catch (error) {
      this.logger.error(error);
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
    this.logger.log('Send Request received.');
    if (!req?.user?.id) {
      this.logger.error('Sender not identified. Aborting...');
      throw new UnauthorizedException('Unauthorized call');
    }

    const sender = await this.usersService.findById(req.user.id);
    if (!sender) {
      this.logger.error('Sender not identified. Aborting...');
      throw new UnauthorizedException('Unauthorized call');
    }

    const destinatory = await this.usersService.findByIdentifier(
      sendFriendRequestDto.destinatory,
    );

    if (!destinatory) {
      this.logger.error("Couldn't find destinatory. Aborting...");
      throw new UnauthorizedException('Invalid destinatory');
    }

    const existingRelation = await this.socialsService.checkExistingRequest(
      sender.id,
      destinatory.id,
    );

    if (existingRelation) {
      this.logger.warn('Friend relationship already existing. Aborting...');
      throw new UnauthorizedException('Request already existing');
    }

    this.logger.log('Tempting to send notification to destinatory');
    const request = await this.socialsService.createRequest(
      sender.id,
      destinatory.id,
    );
    const response = await fetch(
      `http://chat_service:3000/send_request_notif`,
      {
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
          senderId: sender.id,
          destinatoryId: destinatory.id,
        }),
      },
    ).catch((error) => {
      this.logger.error(`Error while contacting chat-service: ${error}`);
    });
    if (response && response.status === 201) {
      this.logger.log('Notification sent succesfully');
    } else this.logger.log("Notification couldn't be sent.");
    return request;
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
    if (!req?.user?.id) throw new UnauthorizedException('Unauthorized call');
    return await this.socialsService.deleteFriendRequest(
      req.user.id,
      requesterId,
    );
  }
}
