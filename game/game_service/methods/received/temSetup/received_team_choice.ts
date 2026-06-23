import type { Player } from "../../../Player";
import { combat } from "../../send/teamSetup/combat";

// CHECK TEAM SENDED AND IF IT'S EMPTY, ELSE AUTO FULLY BATTLE_TEAM IF IT'S POSSIBLE
// WHEN BATTLE_TEAM OK CALL DB GAME AND RETURN COMBAT
export function received_team_choice(player: Player, monster: string[]){

	let count:number = 0
	for (let i = 0; i < monster.length; ++i){
		if (monster[i] !== "")
			count++;
	}
	if (count === 0){
		for (let i = 0; i < player.team.length; ++i){
			if (player.team[i] !== ""){
				player.battle_team[count]["name"] = player.team[i]
				player.battle_team[count]["slot"] = count
				++count;
			}
			if (count === 3)
				break;
		}
	}

	else{
		for (let i = 0; i < player.battle_team.length; ++i){
			player.battle_team[i]["name"] === monster[i]
			player.battle_team[count]["slot"] = i
		}
	}
	// call pour avoir toutes les data des monstre
	return combat(player);
}