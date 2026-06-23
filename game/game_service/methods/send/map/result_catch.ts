import type { Player } from "../../../Player";
import { update_team } from "./update_team";

export function result_catch(player: Player, result: number) {
    return {
        event: "game",
        data: {
            state: "result_catch",
            success: result !== 0
                ? "ok"
                : "fail",
            player: {
				team: result !== 0
                	? player.team
                	: undefined
			}
        }
    };
}