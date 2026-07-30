export interface GamePayload {
  state: string;
  data: {
    state: string;
    [key: string]: any;q
  };
}

export const FULL = 2;

export const PHASE_DURATIONS = {
  lobby: 10,
  map: 30,
  team_setup: 20,
  choose_monster: 30, // happend only if a monster die -> before choose action phase
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
