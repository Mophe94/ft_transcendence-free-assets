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
  godot_fill: 5,
  map: 5,
  team_setup: 20,
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
