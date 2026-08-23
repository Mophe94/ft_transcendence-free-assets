import {
  BadRequestException,
  Body,
  ConflictException,
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
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { JwtHttpGuard } from 'libs/shared/src/auth/guards/jwt-http.guard';
import type { AuthenticatedRequest } from 'libs/shared/src';
import { UsersService } from '../users/users.service';
import { SocialService } from './socials.service';
import { CheckOnlineUsersDto } from 'apps/chat-service/src/chat/dto/checkOnlineUsers.dto';
import { AcceptFriendRequestDto } from './dto/accept-friend-request.dto';
import { RemoveRelationDto } from './dto/remove-relation.dto';
import { SendGameInviteDto } from './dto/send-game-invite.dto';

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
    if (!req?.user?.id) {
      this.logger.warn('[GET /friends] Unauthorized access attempt');
      throw new UnauthorizedException('Unauthorized call');
    }
    const userId = req.user.id;
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
        this.logger.warn(
          `[GET /friends] Chat service returned status ${response.status} for user ${userId}`,
        );
        throw new InternalServerErrorException(
          'Chat service returned an error',
        );
      }

      const onlineUsers = (await response.json()) as CheckOnlineUsersDto;

      return onlineUsers;
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(
        `[GET /friends] Failed to communicate with chatService for user ${userId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      throw new InternalServerErrorException(
        'Failed to communicate with chatService',
      );
    }
  }

  @Get('pending_requests')
  @UseGuards(JwtHttpGuard)
  async getPendingRequest(@Req() req: AuthenticatedRequest) {
    if (!req.user?.id) {
      this.logger.warn('[GET /pending_requests] Unauthorized access attempt');
      throw new UnauthorizedException('Unauthorized call');
    }

    const userId = req.user.id;
    const pendingRequests =
      await this.socialsService.getReceivedRequest(userId);

    this.logger.log(
      `[GET /pending_requests] Retrieved pending requests for user ${userId}`,
    );

    return pendingRequests;
  }

  @Post('send_request')
  @UseGuards(JwtHttpGuard)
  async sendFriendRequest(
    @Req() req: AuthenticatedRequest,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    if (!req?.user?.id) {
      this.logger.warn('[POST /send_request] Unauthorized access attempt');
      throw new UnauthorizedException('Unauthorized call');
    }

    const senderId = req.user.id;

    const sender = await this.usersService.findById(req.user.id);
    if (!sender) {
      this.logger.warn(
        `[POST /send_request] Sender account not found: ${senderId}`,
      );
      throw new UnauthorizedException('Target user not found');
    }

    const destinatory = await this.usersService.findByIdentifier(
      sendFriendRequestDto.destinatory,
    );

    if (!destinatory) {
      this.logger.warn(
        `[POST /send_request] Sender account not found: ${senderId}`,
      );
      throw new UnauthorizedException('Invalid destinatory');
    }

    if (sender.id === destinatory.id) {
      this.logger.warn(
        `[POST /send_request] User ${senderId} attempted to add themselves`,
      );
      throw new BadRequestException('Cannot send a friend request to yourself');
    }

    const existingRelation = await this.socialsService.checkExistingRequest(
      sender.id,
      destinatory.id,
    );

    if (existingRelation) {
      this.logger.warn(
        `[POST /send_request] Relation already exists between ${sender.id} and ${destinatory.id}`,
      );
      throw new ConflictException('Friend request already exists');
    }

    const request = await this.socialsService.createRequest(
      sender.id,
      destinatory.id,
    );

    this.logger.log(
      `[POST /send_request] Friend request created: ${sender.id} -> ${destinatory.id}`,
    );

    try {
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
      );

      if (response.ok) {
        this.logger.log(
          `[POST /send_request] Notification sent to chat service for recipient ${destinatory.id}`,
        );
      } else {
        this.logger.warn(
          `[POST /send_request] Chat service returned status ${response.status} for notification`,
        );
      }
    } catch (error: unknown) {
      this.logger.error(
        `[POST /send_request] Error contacting chat service: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return request;
  }

  @Patch('accept/:id')
  @UseGuards(JwtHttpGuard)
  async acceptRequest(
    @Req() req: AuthenticatedRequest,
    @Param() params: AcceptFriendRequestDto,
  ) {
    if (!req?.user?.id) {
      this.logger.warn('[PATCH /accept/:id] Unauthorized access attempt');
      throw new UnauthorizedException('Unauthorized call');
    }
    const userId = req.user.id;
    const { id: requesterId } = params;

    if (userId === requesterId) {
      this.logger.warn(
        `[PATCH /accept/:id] User ${userId} attempted to accept a request from themselves`,
      );
      throw new BadRequestException(
        'Cannot accept a friend request from yourself',
      );
    }

    const result = await this.socialsService.acceptFriendRequest(
      requesterId,
      userId,
    );

    this.logger.log(
      `[PATCH /accept/:id] User ${userId} accepted friend request from ${requesterId}`,
    );

    return result;
  }

  @Delete('remove_relation/:id')
  @UseGuards(JwtHttpGuard)
  async removeRelationship(
    @Req() req: AuthenticatedRequest,
    @Param() params: RemoveRelationDto,
  ) {
    if (!req?.user?.id) {
      this.logger.warn(
        '[DELETE /remove_relation/:id] Unauthorized access attempt',
      );
      throw new UnauthorizedException('Unauthorized call');
    }
    const userId = req.user.id;
    const { id: targetId } = params;

    if (userId === targetId) {
      this.logger.warn(
        `[DELETE /remove_relation/:id] User ${userId} attempted to remove relationship with themselves`,
      );
      throw new BadRequestException('Cannot remove relationship with yourself');
    }
    const result = await this.socialsService.deleteFriendRequest(
      userId,
      targetId,
    );

    this.logger.log(
      `[DELETE /remove_relation/:id] Relationship removed between ${userId} and ${targetId}`,
    );

    return result;
  }

  @Post('send_game_invite')
  @UseGuards(JwtHttpGuard)
  async sendGameInvite(
    @Req() req: AuthenticatedRequest,
    @Body() sendGameInviteDto: SendGameInviteDto,
  ) {
    if (!req?.user?.id) {
      this.logger.warn('[POST /send_game_invite] Unauthorized access attempt');
      throw new UnauthorizedException('Unauthorized call');
    }

    const senderId = req.user.id;
    const senderUsername = req.user.username;
    const roomId = sendGameInviteDto.roomId;
    const destinatoryId = sendGameInviteDto.destinatory;
    const existingFriendship =
      await this.socialsService.checkExistingFriendship(
        senderId,
        destinatoryId,
      );
    if (!existingFriendship) {
      this.logger.warn(
        `[POST /send_game_invite] No Friendship relation between ${senderId} and ${destinatoryId}`,
      );
      throw new UnauthorizedException('Target user not found');
    }

    const response = await fetch(`http://chat_service:3000/send_game_invite`, {
      headers: { 'Content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        senderId,
        senderUsername,
        destinatoryId,
        roomId,
      }),
    }).catch((error: unknown) => {
      this.logger.error(
        `[POST /send_game_invite] Error contacting chat service: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    });

    if (response && response.ok) {
      this.logger.log(
        `[POST /send_game_invite] Notification sent to chat service for recipient ${destinatoryId}`,
      );
      return { send: true };
    } else {
      this.logger.warn(
        `[POST /send_game_invite] Chat service returned status ${response?.status} for game invitation`,
      );
    }

    return { send: false };
  }
}
