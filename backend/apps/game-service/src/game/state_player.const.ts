export const STATE_PLAYER = {
  player: (playerid: string) => `game:statePlayer:playerId:${playerid}`,
  state: (playerid: string) => `game:statePlayer:playerId:${playerid}:state`,
}