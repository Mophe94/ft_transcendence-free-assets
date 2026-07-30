import { Injectable } from '@nestjs/common';
import { Player } from './player';

@Injectable()
export class PlayerService {
  players = new Map<number, Player>();
  idsByPlayers = new Map<Player, number>();


  initPlayer(userId: number /* , payload: any */): void {
    const player = new Player(
      userId,
      'Test', //need to retrieve name from userDB
      'dino',
    );
    this.players.set(userId, player);
    this.idsByPlayers.set(player, userId);

  }

  getPlayer(userId: number): Player | undefined {
    return this.players.get(userId);
  }

  // To complete (add remove, etc)
  getUserId(player: Player): number | undefined{
    const id = this.idsByPlayers.get(player);
    return id;
  }

  removePlayer(userId: number): void {
    this.players.delete(userId);
  }
}
