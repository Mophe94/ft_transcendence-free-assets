export interface Inventory {
	name: string;
	scene: string;
	current: number;
	value: number;
	type: string;
	target: string
}

export interface Skill {
	name: string;
	current: number;
	max: number,
	type: string,
	effect: string,
	repetition: number,
	precision: number,
	data: string
	value: number
}

export interface Life {
	current: number;
	max:number
}

export interface CurrentMonster {
	name: string;
	life: Life;
	type: string,
	attack: number,
	attack_spe: number,
	defense: number,
	defense_spe: number,
	speed: number,
	slot: number;
	status: string[];
	skill: Skill[];
	dodge: boolean;
}

export interface CurrentActions {
	actionType: "try_attack" | "use_item_combat" | "change_current_monster" | "pass" | undefined;
	data: any;
  }

export function emptyCurrentMonster(): CurrentMonster {
	return {
		name: "", slot: -1, life: { current: 0, max: 0 }, type: "",
		attack: 0, attack_spe: 0, defense: 0, defense_spe: 0, speed: 0,
		status: [], dodge: false, 
		skill: [],
	};
}
