import {
  Team,
  Inventory,
  Skill,
  Life,
  CurrentMonster,
} from 'apps/game-service/src/game/player/player.interfaces';

export class Player {
  readonly id: number = -1;
  readonly name: string = '';
  readonly asset: string = '';
  currentMonster: CurrentMonster = {
    name: '',
    slot: -1,
    life: {
      current: 0,
      max: 0,
    },
    type: '',
    status: [],
    skill: [
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
      },
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
      },
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
      },
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
      },
    ],
  };
  battle_team: CurrentMonster[] = [
    {
      name: '',
      slot: -1,
      life: {
        current: 0,
        max: 0,
      },
      type: '',
      status: [],
      skill: [
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
      ],
    },
    {
      name: '',
      slot: -1,
      life: {
        current: 0,
        max: 0,
      },
      type: '',
      status: [],
      skill: [
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
      ],
    },
    {
      name: '',
      slot: -1,
      life: {
        current: 0,
        max: 0,
      },
      type: '',
      status: [],
      skill: [
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
        },
      ],
    },
  ];
  team: string[] = ['pisciner', 'sharky', 'fishet', 'monkel', 'burpy', ''];
  inventory: Inventory[] = [
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
    },
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
    },
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
    },
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
    },
  ];
  timer: number = 0;
  current_map: string = '';
  current_monster: string = '';
  current_item: string = '';
  text: string = '';

  constructor(new_id: number, name: string, asset: string) {
    this.id = new_id;
    this.name = name;
    this.asset = asset;
  }
}
