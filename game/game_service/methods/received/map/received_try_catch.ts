import type { Player } from "../../../Player";
import { result_catch } from "../../send/map/result_catch";

// CHECK MATCH OF MONSTER WITH RANDOM VALUE AND RETURN TRUE IF OK OR FALSE
export function received_try_catch(player: Player){
	let result = Math.floor(Math.random() * 101);

	if (result <= player.current_monster_catch){
		for (let i = 0; i < player.team.length; ++i){
			if (player.team[i] === ""){
			player.team[i] = player.current_monster;
			break;
			}
		}
		return result_catch(player, 1);
	}
	else
		return result_catch(player, 0);
}