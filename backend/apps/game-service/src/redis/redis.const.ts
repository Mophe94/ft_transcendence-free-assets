export const REDIS_CLIENT = 'REDIS_CLIENT';

export const REDIS_KEYS = {
  GAME_ACTIVE_ROOMS: 'game:rooms:active',
  GAME_INACTIVE_ROOMS: 'game:rooms:inactive',
  ACTIVE_PLAYERS: (roomId: string) => {
    return `game:rooms:active:${roomId}:players`;
  },
  INACTIVE_PLAYERS: (roomId: string) => {
    return `game:rooms:inactive:${roomId}:players`;
  },

};
