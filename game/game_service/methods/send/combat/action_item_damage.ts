import type { Player } from "../../../Player";

export function action_item_damage(player: Player, enemy: Player, charactere: string, value: number){
     return {
        event: "game",
        data: {
            state: "action_item_damage",
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