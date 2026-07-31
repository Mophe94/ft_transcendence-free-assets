import type { Player } from "../../../Player";

export function next_map(player: Player){
    return {
        event: "game",
        data: {
            state: "next_map",
			timer: player.timer,
            current_map: player.current_map
        }
    }
}