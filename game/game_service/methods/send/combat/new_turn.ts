import type { Player } from "../../../Player";

export function new_turn(player: Player){
    return {
        event: "game",
        data: {
            state: "new_turn",
            timer: player.timer
        }
    }
}