import type { Player } from "../../../Player";

export function update_team(player: Player){
    return {
        event: "game",
        data: {
            state: "update_team",
			player: {
            	team: player.team
			}
        }
    }
}