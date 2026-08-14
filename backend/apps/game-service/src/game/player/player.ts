import {
  Inventory,
  Skill,
  Life,
  CurrentMonster,
  CurrentActions,
} from 'apps/game-service/src/game/player/player.interfaces';
import { emptyCurrentMonster } from './player.interfaces';

export class Player {
  readonly id: string = '';
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
    attack: 0,
    attack_spe: 0,
    defense: 0,
    defense_spe: 0,
    speed: 0,
    status: [],
    dodge: false,
    skill: [
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
        effect: '',
        repetition: 0,
        precision: 0,
        data: '',
        value: 0,
      },
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
        effect: '',
        repetition: 0,
        precision: 0,
        data: '',
        value: 0,
      },
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
        effect: '',
        repetition: 0,
        precision: 0,
        data: '',
        value: 0,
      },
      {
        name: '',
        current: 0,
        max: 0,
        type: '',
        effect: '',
        repetition: 0,
        precision: 0,
        data: '',
        value: 0,
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
      attack: 0,
      attack_spe: 0,
      defense: 0,
      defense_spe: 0,
      speed: 0,
      status: [],
      dodge: false,
      skill: [
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
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
      attack: 0,
      attack_spe: 0,
      defense: 0,
      defense_spe: 0,
      speed: 0,
      status: [],
      dodge: false,
      skill: [
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
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
      attack: 0,
      attack_spe: 0,
      defense: 0,
      defense_spe: 0,
      speed: 0,
      status: [],
      dodge: false,
      skill: [
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
        {
          name: '',
          current: 0,
          max: 0,
          type: '',
          effect: '',
          repetition: 0,
          precision: 0,
          data: '',
          value: 0,
        },
      ],
    },
  ];
  team: string[] = ['pisciner', 'burpy', 'fishet', '', '', ''];
  inventory: Inventory[] = [
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
      type: '',
      target: '',
    },
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
      type: '',
      target: '',
    },
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
      type: '',
      target: '',
    },
    {
      name: '',
      scene: '',
      current: 0,
      value: 0,
      type: '',
      target: '',
    },
  ];
  currentActions: CurrentActions = {
    actionType: undefined,
    data: undefined,
  };
  roundsRemaining: number = 0;
  status: string = 'default';
  teamReady: boolean = false;
  forceChooseMonster: boolean = false;
  timer: number = 0;
  current_map: string = '';
  current_monster: string = '';
  current_monster_rarity: string = '';
  current_item: string = '';
  text: string = '';

  constructor(new_id: string, name: string, asset: string) {
    this.id = new_id;
    this.name = name;
    this.asset = asset;
    this.team[0] = 'pisciner';
  }

  resetAfterRound(): void {
    this.forceChooseMonster = false;
    this.currentActions.actionType = undefined;
    this.currentActions.data = '';
    this.text = '';
    this.battle_team = [];
    this.currentMonster = emptyCurrentMonster();
  }
}
