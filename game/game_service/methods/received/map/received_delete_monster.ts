import type { Player } from "../../../Player";
import { update_team } from "../../send/map/update_team";

// DELETE MONSTER + SEND UPDATE_TEAM
export function received_delete_monster(player: Player, monster: string){
	for (let i = 0; i < player.team.length; ++i){
		if (player.team[i] === monster){
			player.team[i] = "";
			break;
		}
	}
	return update_team(player);
}