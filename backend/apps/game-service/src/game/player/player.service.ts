import { Injectable } from '@nestjs/common';
import { Player } from './player';

@Injectable()
export class PlayerService {
  players = new Map<string, Player>();
  idsByPlayers = new Map<Player, string>();

  initPlayer(userId: string): void {
    const player = new Player(
      userId,
      userId.toString(), //need to retrieve name from userDB
      'dino',
    );
    this.players.set(userId, player);
    this.idsByPlayers.set(player, userId);
  }
  
  injectPlayer(userId: string, player: Player): void {
    this.players.set(userId, player);
  }

  initDefaultPlayer(): Player {
    const player = new Player(
      '',
      '',
      'dino',
    );
    return player;
  }

  getPlayer(userId: string): Player | undefined {
    return this.players.get(userId);
  }

  getUserId(player: Player): string | undefined {
    const id = this.idsByPlayers.get(player);
    return id;
  }

  removePlayer(userId: string): void {
    const player = this.players.get(userId);
    this.players.delete(userId);
    this.idsByPlayers.delete(player!);
  }
}
