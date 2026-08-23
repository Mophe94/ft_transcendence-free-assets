export interface GameData {
  state: string ;
  [key: string]: any;
}

export interface GameMessage {
  event: string;
  data: GameData;
}

export interface RoomAcces {
  capacity: number;
  skin: string;
}

export type PlayerPhase = 'map' | 'team_choice' | 'combat';

export const PHASE_DURATIONS = {
  lobby: 30,
  map: 185,
  team_setup: 25,
  choose_action: 25,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;
