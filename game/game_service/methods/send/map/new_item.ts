import type { Player } from "../../../Player";

export function new_item(this: Player){
	return {
		event: "game",
		data: {
			state: "new_item",
			current_item: this.current_item
		}
	}
}