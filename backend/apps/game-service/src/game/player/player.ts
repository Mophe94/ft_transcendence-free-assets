import { Team, Inventory, Skill, Life, CurrentMonster } from 'apps/game-service/src/game/player/player.interfaces'

export class Player {
	readonly id: number = -1;
	readonly name: string = "";
	readonly asset: string = "";
	currentMonster: CurrentMonster = {
		name: "",
		slot: -1,
		life: {
			current: 0,
			max: 0
		},
		type: "",
		status: [],
		skill: [
			{
				name: "",
				current: 0,
				max: 0,
				type: ""
			},
			{
				name: "",
				current: 0,
				max: 0,
				type: ""
			},
			{
				name: "",
				current: 0,
				max: 0,
				type: ""
			},
			{
				name: "",
				current: 0,
				max: 0,
				type: ""
			},
		],
	};
	battle_team: CurrentMonster[] = [
		{
			name: "",
			slot: -1,
			life: {
				"current": 0,
				"max": 0
			},
			type: "",
			status: [],
			skill: [
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
			],
		},
		{
			name: "",
			slot: -1,
			life: {
				"current": 0,
				"max": 0
			},
			type: "",
			status: [],
			skill: [
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
			],
		},
		{
			name: "",
			slot: -1,
			life: {
				"current": 0,
				"max": 0
			},
			type: "",
			status: [],
			skill: [
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
				{
					name: "",
					current: 0,
					max: 0,
					type: ""
				},
			],
		},
	];
	team: string[] = ["", "", "", "", "", ""];
	inventory: Inventory[] = [
		{
			name: "",
			scene: "",
			current: 0,
			value: 0
		},
		{
			name: "",
			scene: "",
			current: 0,
			value: 0
		},
		{
			name: "",
			scene: "",
			current: 0,
			value: 0
		},
		{
			name: "",
			scene: "",
			current: 0,
			value: 0
		},
	];
	timer: number = 0
	current_map: string = ""
	current_monster: string = ""
	current_item: string  = ""
	text: string = ""

	new_current_item: () => object
	new_encounter: () => object
	result_catch: (result: number) => object
	start_map: () => object
	team_setup: (enemy: Player) => object
	update_inventory: () => object
	update_team: () => object

	combat: () => object

	changeMonster: (new_monster: number) => object
	attack: (enemy: Player, attackName: string) => object

	constructor(new_id: number, name: string, asset: string){
		this.id = new_id;
		this.name = name;
		this.asset = 'asset'
	}
}