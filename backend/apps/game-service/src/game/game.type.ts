export interface GameData {
  state: string;
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
  lobby: 10,
  map: 5,
  team_setup: 15,
  choose_action: 20,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;
