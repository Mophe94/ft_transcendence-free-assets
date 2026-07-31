import { Player } from "../../../Player";

export function new_round(player: Player){
        return {
        event: "game",
        data: {
            state: "new_round",
            timer: player.timer
        }
    }
}