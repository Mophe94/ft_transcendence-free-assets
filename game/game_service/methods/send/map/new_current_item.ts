import type { Player } from "../../../Player";

export function new_current_item(player: Player){
	return {
		event: "game",
		data: {
			state: "new_current_item",
			current_item: player.current_item
		}
	}
}