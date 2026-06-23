import type { Player } from "../../../Player";

export function combat(player: Player){
    return {
    event: "game",
        data: {
            state: "combat",
            timer: player.timer,
            player: {
                battle_team: player.battle_team
            }
        }
    }
}