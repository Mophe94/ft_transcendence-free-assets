import type { Inventory, Skill, Life, CurrentMonster } from "./type/interfaces";

import { finish } from "./methods/send/finish";

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
		attack: 0,
		attack_spe: 0,
		defense: 0,
		defense_spe: 0,
		speed: 0,
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
			attack: 0,
			attack_spe: 0,
			defense: 0,
			defense_spe: 0,
			speed: 0,
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
			attack: 0,
			attack_spe: 0,
			defense: 0,
			defense_spe: 0,
			speed: 0,
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
			attack: 0,
			attack_spe: 0,
			defense: 0,
			defense_spe: 0,
			speed: 0,
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
			value: 0,
			type: "",
			target: ""
		},
		{
			name: "",
			scene: "",
			current: 0,
			value: 0,
			type: "",
			target: ""
		},
		{
			name: "",
			scene: "",
			current: 0,
			value: 0,
			type: "",
			target: ""
		},
		{
			name: "",
			scene: "",
			current: 0,
			value: 0,
			type: "",
			target: ""
		},
	];
	timer: number = 0
	current_map: string = ""
	current_monster: string = ""
	current_monster_catch: number = 0
	current_item: string  = ""
	text: string = ""

	constructor(new_id: number, name: string, asset: string){
		this.id = new_id;
		this.name = name;
		this.asset = asset
		this.team[0] = "pisciner"
	}
}