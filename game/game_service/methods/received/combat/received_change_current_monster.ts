import type { Player } from "../../../Player";
import { update_current_monster } from "../../send/combat/update_current_monster";

export function received_update_current_monster(player: Player, slot: number){
	const temp = player.currentMonster.name;
	player.currentMonster = player.battle_team[slot]

	return update_current_monster(player, temp);
}