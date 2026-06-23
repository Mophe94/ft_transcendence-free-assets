import type { Player } from "../../../Player";

export function new_encounter(player: Player){
    return {
        event: "game",
        data: {
            state: "new_encounter",
            current_monster: player.current_monster
        }
    }
}