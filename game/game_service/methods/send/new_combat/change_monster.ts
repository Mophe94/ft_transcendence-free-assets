import type { Player } from "../../../Player";

export function action_battle(player: Player){
	return {
		event: "game",
		data: {
			state: "change_monster",
		}
	}
}