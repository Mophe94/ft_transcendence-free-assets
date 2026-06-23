import type { Player } from "../../../Player";

export function update_inventory(player: Player){
	return {
		event: "game",
		data: {
			state: "update_inventory",
			player: {
				inventory: player.inventory
			}
		}
	}
}