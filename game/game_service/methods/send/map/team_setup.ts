import type { Player } from "../../../Player";

export function team_setup(player: Player, enemy: Player){
    return {
        event: "game",
        data: {
            state: "team_setup",
            timer: player.timer,
            player: {
                team: player.team
            },
            enemy: {
                id: enemy.id,
                name: enemy.name,
                asset: enemy.asset,
                team: enemy.team
            }
        }
    }
}