import type { Player } from "../../../Player";

export function lose(player: Player){
    return {
        event: "game",
        data: {
            state: "lose",
        }
    }
}