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
  map: 50,
  team_setup: 10,
  choose_action: 20,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;