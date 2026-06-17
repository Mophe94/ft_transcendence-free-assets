import type { Player } from "../player/player";

export function new_encounter(player: Player){
    return {
        event: "game",
        data: {
            state: "new_encounter",
            current_monster: player.current_monster
        }
    }
}