interface Inventory {
	name: string;
	current: number;
}

interface Skill {
	name: string;
	current: number;
	max: number,
	type: string
}

interface Life {
	current: number;
	max:number
}

interface CurrentMonster {
	name: string;
	life: Life;
	type: string,
	slot: number;
	status: string[];
	skill: Skill[]
}

class Player {
	readonly id: number = -1;
	readonly name: string = "Gerard";
	readonly asset: string = "dino";
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
	]

	constructor(new_id: number, name: string, asset: string) {this.id = new_id; this.name = name; this.asset = asset}







	changeMonster(newMonster: number) {
		if (this.battle_team[newMonster].name === "" || this.battle_team[newMonster].life.current === 0)
			return {
				event: "game",
				data: {
					type: "changeMonsterResult",
					text: this.name + " try to change is monster but fail !"
				}
		}
		const oldMonster = this.currentMonster;
		this.currentMonster = this.battle_team[newMonster];
		this.battle_team[newMonster] = oldMonster;

		return {
			event: "game",
	    	data: {
				type: "changeMonsterResult",
				player: {
	    	    	currentMonster: {
						name: this.currentMonster.name,
						slot: this.currentMonster.slot,
						life: {
							current: this.currentMonster.life.current,
							max: this.currentMonster.life.max
						},
					},
					status: this.currentMonster.status,
					skill: this.currentMonster.skill,
					battle_team: [
						{
							name: this.battle_team[0].name,
							slot: this.battle_team[0].slot,
							life: this.battle_team[0].life
						},
						{
							name: this.battle_team[1].name,
							slot: this.battle_team[1].slot,
							life: this.battle_team[1].life
						},
						{
							name: this.battle_team[2].name,
							slot: this.battle_team[2].slot,
							life: this.battle_team[2].life
						}
					]
				},
				text: this.name + " change " + oldMonster + " and " + this.currentMonster.name + " enter !"
			}
		}
	}







	
	attack(enemy: Player, attackName: string) {
		const skill = this.currentMonster.skill.find(s => s.name === attackName);
		if (enemy == null || skill == null || skill.current <= 0)
			return {
				event: "game",
				data: {
					type: "attackResult",
					text: this.currentMonster.name + " fail to use " + attackName
				}
			}
		const result = attackResult(skill.type, enemy.currentMonster.type, this.currentMonster.type);
		if (result.result >= enemy.currentMonster.life.current)
			result.result = enemy.currentMonster.life.current
		let lifeLeft: number = enemy.currentMonster.life.current - result.result;
		return {
			event: "game",
			data: {
				type: "attackResult",
				text: this.currentMonster.name + " use " + attackName + " on " + enemy.changeMonster.name + result.effectiveness
			}
		}
	}
}

const typeChart: Record<string, Record<string, number>> = {
    "fire":  { "plant": 2, "water": 0.5, "neutral": 1 },
    "water":  { "fire": 2, "plant": 0.5, "earth": 0.5, "neutral": 1 },
    "earth": { "water": 2, "fire": 0.5, "plant": 0.5, "neutral": 1 },
	"plant": { "water": 2, "earth": 2, "neutral": 1 },
	"neutral": { "water": 1, "fire": 1, "plant": 1, "earth": 1 }
};

function attackResult(attackType: string, enemyType: string, monsterType: string){
//	ask for attack and attack_spe
//	attack = 0 but attack = attack
	let effectiveness: string = ".";
	let flatAttackDammage: number = 0
//	if (attackType == monster.type)
//		flatAttackDammage = attackspe
	let  multi: number = typeChart[attackType]?.[enemyType] ?? 1;
	if (multi >= 2)
		effectiveness = " it's super effectiveness !";
	else if (multi <= 0.5)
		effectiveness = " it's not effectiveness.";
	let result = Math.trunc(flatAttackDammage * multi);
	return { result, effectiveness }
};

// const player = new Player(1, "Gerard", "dino");

// player.battle_team = [
//     { name: "A", slot: 0, life: { current: 10, max: 10 }, status: [], skill: [] },
//     { name: "B", slot: 1, life: { current: 20, max: 20 }, status: [], skill: [] },
//     { name: "C", slot: 2, life: { current: 30, max: 30 }, status: [], skill: [] },
// ];

// player.currentMonster = player.battle_team[0];

// console.log("AVANT :", player.currentMonster.name);

// const result = player.changeMonster(2);

// console.log("APRÈS :", player.currentMonster.name);
// console.log("RESULT :", result);