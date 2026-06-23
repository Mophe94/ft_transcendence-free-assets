import type { Player } from "../../../Player";

export function action_item_heal(player: Player, charactere: string, value: number){
     return {
        event: "game",
        data: {
        	state: "action_item_heal",
        	target: charactere,
        	value: value,
			enemy: {
				currentMonster: player.currentMonster
			},
			player: {
				inventory: player.inventory,
				currentMonster: player.currentMonster
			}
		}
	}
}