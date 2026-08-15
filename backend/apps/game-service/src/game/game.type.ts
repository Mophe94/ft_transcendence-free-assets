export interface GamePayload {
  state: string;
  data: {
    state: string;
    [key: string]: any;
  };
}

export const FULL = 4;

export const PHASE_DURATIONS = {
  lobby: 10,
  map: 90,
  team_setup: 20,
  choose_action: 60,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;

