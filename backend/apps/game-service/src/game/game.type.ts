export interface GamePayload {
  state: string;
  data: {
    state: string;
    [key: string]: any;
  };
}

export const FULL = 1;

export const PHASE_DURATIONS = {
  lobby: 10,
  map: 120,
  team_setup: 10,
  choose_monster: 30,
  choose_action: 30,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;

// DELETE when Guard is implemented
let mockUserCounter = 0;
export const createMockUser = () => {
  mockUserCounter++;
  return {
    userId: mockUserCounter,
  };
};
