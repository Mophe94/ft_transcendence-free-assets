import type { Player } from "../../../Player"
import { CurrentMonster } from "../../../type/interfaces";

	
// export function	changeMonster(this: Player, newMonster: number) {
// 	if (this.battle_team[newMonster].name === "" || this.battle_team[newMonster].life.current === 0)
// 		return {
// 			event: "game",
// 			data: {
// 				state: "update_current_monster",
// 				text: this.name + " try to change is monster but fail !"
// 			}
// 	}
// 	const oldMonster = this.currentMonster;
// 	this.currentMonster = this.battle_team[newMonster];
// 	this.battle_team[newMonster] = oldMonster;

// 	return {
// 		event: "game",
// 		data: {
// 			state: "changeMonster",
// 			player: {
// 		    	currentMonster: this.currentMonster,
// 				battle_team: this.battle_team
// 			},
// 			text: this.name + " change " + oldMonster + " and " + this.currentMonster.name + " enter !"
// 		}
// 	}
// }

export function	update_current_monster(player: Player, oldMonster: string) {
	return {
		event: "game",
		data: {
			state: "update_current_monster",
			player: {
		    	currentMonster: player.currentMonster,
				battle_team: player.battle_team
			},
			oldMonster: oldMonster
		}
	}
}