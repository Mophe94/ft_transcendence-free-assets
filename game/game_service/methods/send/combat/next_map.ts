import type { Player } from "../../../Player";

export function next_map(player: Player){
    return {
        event: "game",
        data: {
            state: "next_map",
            current_map: player.current_map
        }
    }
}