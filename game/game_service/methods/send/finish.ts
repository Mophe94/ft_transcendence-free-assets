import type { Player } from "../../Player";

export function finish(player: Player){
	return {
	event: "game",
		data: {
			state: "finish"
		}
	}
}