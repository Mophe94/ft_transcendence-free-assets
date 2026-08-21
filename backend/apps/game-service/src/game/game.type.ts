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

export const PHASE_DURATIONS = {
  lobby: 30,
  map: 180,
  team_setup: 30,
  choose_action: 30,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;
