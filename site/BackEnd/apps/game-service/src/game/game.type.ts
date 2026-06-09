export interface GamePayload {
  state: string;
  data?: any;
}

export const FULL_LOBBY = 8;

export const PHASE_DURATIONS = {
  lobby: 5,
  map: 200,
  team_setup: 60,
  choose_monster: 30,
  choose_action: 30,
};

export type PhaseName = keyof typeof PHASE_DURATIONS;

// DELETE when Guard is implemented
let mockUserCounter = 0;
export const createMockUser = () => {
  mockUserCounter++;
  return {
    sub: mockUserCounter,
    username: `user_${mockUserCounter}`,
  };
};
