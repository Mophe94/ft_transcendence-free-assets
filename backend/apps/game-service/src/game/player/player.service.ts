import { Injectable } from '@nestjs/common';
import { Player } from './player';

@Injectable()
export class PlayerService {
  players = new Map<number, Player>();
  idsByPlayers = new Map<Player, number>();


  initPlayer(userId: number /* , payload: any */): void {
    const player = new Player(
      userId,
      userId.toString(), //need to retrieve name from userDB
      'dino',
    );
    this.players.set(userId, player);
    this.idsByPlayers.set(player, userId);

  }
  
  injectPlayer(userId: number, player: Player): void {
    this.players.set(userId, player);
  }

  getPlayer(userId: number): Player | undefined {
    return this.players.get(userId);
  }

  getUserId(player: Player): number | undefined{
    const id = this.idsByPlayers.get(player);
    return id;
  }

  removePlayer(userId: number): void {
    const player =this.players.get(userId);
    this.players.delete(userId);
    this.idsByPlayers.delete(player!);
  }
}
