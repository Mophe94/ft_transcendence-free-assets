import type { Player } from "../../../Player";

export function action_battle(player: Player, order: number, max: number){
	return {
        event: "game",
        data: {
            state: "action_battle",
			order: order,
			max: max,
            player: player
        }
    }
}