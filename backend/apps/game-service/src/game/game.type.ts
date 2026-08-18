export interface GameData {
  state: string;
  [key: string]: any;
}

export interface GameMessage {
  event: string;
  data: GameData;
}

export const FULL = 2;

export const PHASE_DURATIONS = {
  lobby: 10,
  map: 60,
  team_setup: 15,
  choose_action: 15,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;
