import type { Player } from "../../../Player";
import { action_battle } from "../../send/new_combat/action_battle";

export function received_change_current_monster(player: Player, slot: number, order: number){
	const temp = player.currentMonster.name;
	if (slot >= 0 && slot <= 2 && player.battle_team[slot]["name"] != "" && player.battle_team[slot]["life"]["current"] > 0){
		player.currentMonster = player.battle_team[slot]
		player.text =  player.name + " change " + temp + " for " + player.currentMonster.name
	}
	else if (slot === -1){
		for (let i = 0; i < player.battle_team.length; ++i){
			if (player.battle_team[i]["name"] != "" && player.battle_team[i]["life"]["current"] != 0){
				player.currentMonster = player.battle_team[i]
				player.text =  player.name + " change " + temp + " for " + player.currentMonster
				break
			}
		}
	}
	else
		player.text = player.name + " fail to change " + temp

	return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
}