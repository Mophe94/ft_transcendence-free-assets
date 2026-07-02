import type { Player } from "../../../Player"

	
export function	changeMonster(this: Player, newMonster: number) {
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
			state: "changeMonsterResult",
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