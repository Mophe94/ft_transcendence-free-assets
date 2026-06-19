import type { Player } from '../player/player';

export function start_game(player: Player) {
  // return {
  //   event: 'game',
  //   data: {
  //     state: 'start_game',
  //     player: {
  //       id: player.id,
  //       name: player.name,
  //       asset: player.asset,
  //       team: player.team,
  //     },
  //     timer: player.timer,
  //     current_map: player.current_map,
  //   },
  // };
  return {
    event: 'game',
    data: {
      state: 'start_game',
      player: {
        id: player.id,
        name: 'Ce que tu veux',
        asset: 'dino',
        team: player.team,
      },
      timer: player.timer,
      current_map: 'map_01',
    },
  };
}
