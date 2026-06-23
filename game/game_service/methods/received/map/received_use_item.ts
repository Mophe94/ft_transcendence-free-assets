import type { Player } from "../../../Player";
import { result_catch } from "../../send/map/result_catch";
import { received_delete_item } from "./received_delete_item";

// CALL REMOVE ITEM + ADD MONSTER IN TEAM + SEND RESULT_CATCH WITH UPDATE_TEAM
export function received_use_item(player: Player, item: string){
	received_delete_item(player, item);

	for (let i = 0; i < player.team.length; ++i){
		if (player.team[i] === "")
		player.team[i] = player.current_monster;
		break;
	}
	return result_catch(player, 1);
}