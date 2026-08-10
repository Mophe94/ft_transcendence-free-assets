export const STATE_PLAYER = {
  room: (roomid: string) => `game:statePlayer:roomid${roomid}`,
  player: (roomid: string, playerid: string) => `game:statePlayer:roomid${roomid}:playerid:${playerid}`,
  state: (roomid: string, playerid: string) => `game:statePlayer:roomid${roomid}:playerid:${playerid}:state`,
  round: (roomid: string) => `game:statePlayer:roomid${roomid}:round`,
}