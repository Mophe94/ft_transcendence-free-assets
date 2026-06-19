export interface Team {
  name: string;
  scene: string;
  current: number;
  value: number;
}

export interface Inventory {
  name: string;
  scene: string;
  current: number;
  value: number;
}

export interface Skill {
  name: string;
  current: number;
  max: number;
  type: string;
}

export interface Life {
  current: number;
  max: number;
}

export interface CurrentMonster {
  name: string;
  life: Life;
  type: string;
  slot: number;
  status: string[];
  skill: Skill[];
}
