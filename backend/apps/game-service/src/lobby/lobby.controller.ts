import { Controller, Get, UseGuards } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
// import { JwtAuthGuard } from 'apps/account-service/src/auth/guards/jwt-auth.guard';

// interface Rooms {
//   roomId: string;
//   status: string;
//   nb_players: string;
// }

@Controller()
export class LobbyController {
  constructor(private readonly redis: RedisService) {}
  @Get('get_rooms')
  // @UseGuards(JwtAuthGuard)
  async getRooms() {
    const [active_rooms, inactive_rooms] = await Promise.all([
      this.redis.getActiveRooms(),
      this.redis.getInactiveRooms(),
    ]);

    const activeRoomsPromises = active_rooms.map(async (roomId) => ({
      roomId,
      status: 'Ongoing',
      nb_player: await this.redis.countPlayersInRoom(roomId),
    }));
    const inactiveRoomsPromises = inactive_rooms.map(async (roomId) => ({
      roomId,
      status: 'Waiting for players',
      nb_player: await this.redis.countPlayersInRoom(roomId),
    }));

    const rooms = await Promise.all([
      ...inactiveRoomsPromises,
      ...activeRoomsPromises,
    ]);
    return { rooms };
  }
}
