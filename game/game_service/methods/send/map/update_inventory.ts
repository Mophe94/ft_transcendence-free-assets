import type { Player } from "../../../Player";

export function update_inventory(this: Player){
	return {
		event: "game",
		data: {
			state: "update_inventory",
			player: {
				inventory: this.inventory
			}
		}
	}
}