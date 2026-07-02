import type { Player } from "../../../Player";

export function start_map(this: Player){
	return {
		event: "game",
		data: {
			state: "start_map",

			player: {
				id: this.id,
				name: this.name,
				asset: this.asset,
				team: this.team
			},
			current_map: this.current_map
		}
	}
}