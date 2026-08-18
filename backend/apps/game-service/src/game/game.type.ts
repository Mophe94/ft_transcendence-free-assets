export interface GameData {
  state: string;
  [key: string]: any;
}

export interface GamePayload {
  data: GameData;
}

export interface GameMessage {
  event: string;
  data: GameData;
}

export const FULL = 2;

export const PHASE_DURATIONS = {
  lobby: 10,
  map: 180,
  team_setup: 30,
  choose_action: 30,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;
