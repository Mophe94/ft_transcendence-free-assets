export interface GamePayload {
  state: string;
  data: {
    state: string;
    [key: string]: any;
  };
}

export const FULL = 2;

export const PHASE_DURATIONS = {
  lobby: 10,
  map: 10,
  team_setup: 10,
  choose_action: 30,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;

let mockUserCounter = 0;
export const createMockUser = () => {
  mockUserCounter++;
  return {
    userId: mockUserCounter,
  };
};
