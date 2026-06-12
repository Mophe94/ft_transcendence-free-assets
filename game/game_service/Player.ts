import type { Inventory, Skill, Life, CurrentMonster } from "./type/interfaces";
import { changeMonster } from "./methods/send/combat/changeMonster";
import { attack } from "./methods/send/combat/attack";
import { new_item } from "./methods/send/map/new_item";

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
			current: 0
		},
		{
			name: "",
			current: 0
		},
		{
			name: "",
			current: 0
		},
		{
			name: "",
			current: 0
		},
	];
	current_map: string = ""
	current_monster: string = ""
	current_item: string  = ""
	text: string = ""


	declare changeMonster: (new_monster: number) => object
	declare attack: (enemy: Player, attackName: string) => object


	constructor(new_id: number, name: string, asset: string){
		this.id = new_id;
		this.name = name;
		this.asset = asset
	}
}