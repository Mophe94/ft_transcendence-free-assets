import type { Player } from "../../../Player";
import { result_catch } from "../../send/map/result_catch";

const table_catch = {
	common: 70,
	uncommon: 50,
	rare: 20
}

// CHECK MATCH OF MONSTER WITH RANDOM VALUE AND RETURN TRUE IF OK OR FALSE
export function received_try_catch(player: Player, add?: string){
	let result: number = 0

	if (add !== undefined)
		result = Math.floor(Math.random() * 101);

	let monsterCatch: number = 0
	monsterCatch = table_catch[player.current_monster_rarity as keyof typeof table_catch]
	if (monsterCatch !== undefined) {
		if (result <= monsterCatch) {
    		for (let i = 0; i < player.team.length; ++i) {
    	    	if (player.team[i] === '') {
    	      	player.team[i] = player.current_monster;
    	      	return result_catch(player, 1);
    	    	}
    		}
		}
		else
			return result_catch(player, 0);
	}
	else
		return result_catch(player, 0);
}