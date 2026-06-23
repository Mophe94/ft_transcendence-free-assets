import type { Player } from "../../../Player";
import { action_item_damage } from "../../send/combat/action_item_damage";
import { action_item_heal } from "../../send/combat/action_item_heal";
import { action_item_stat } from "../../send/combat/action_item_status";
import { update_current_monster } from "../../send/combat/update_current_monster";

export function received_use_item_combat(player: Player, enemy: Player, item: string){
	let i: number = 0
	for (i; i < player.inventory.length; ++i){
		if (player.inventory[i]["name"] === item){
			break;
		}
	}
	if (player.inventory[i].type == "heal"){
		player.currentMonster.life.current += player.inventory[i].value;
		if (player.currentMonster.life.current > player.currentMonster.life.max)
			player.currentMonster.life.current = player.currentMonster.life.max
		return action_item_heal(player, "player", player.inventory[i].value)
	}
	else if (player.inventory[i].type == "damage"){
		enemy.currentMonster.life.current -= enemy.inventory[i].value;
		if (enemy.currentMonster.life.current <= 0)
			enemy.currentMonster.life.current = 0
		return action_item_damage(player, enemy, "enemy", player.inventory[i].value)
	}
	else if (player.inventory[i].type == "stat_down") {
		switch (player.inventory[i].target){
			case "attack":
				enemy.currentMonster.attack -= player.inventory[i].value
				break;
			case "attack_spe":
				enemy.currentMonster.attack_spe -= player.inventory[i].value
			case "defense":
				enemy.currentMonster.defense -= player.inventory[i].value
			case "attack_spe":
				enemy.currentMonster.defense_spe -= player.inventory[i].value
			case "speed":
				enemy.currentMonster.speed -= player.inventory[i].value
		}
		return action_item_stat(player, "enemy", player.inventory[i].target, player.inventory[i].type)
	}
	else {
		switch (player.inventory[i].target){
			case "attack":
				player.currentMonster.attack += player.inventory[i].value
				break;
			case "attack_spe":
				player.currentMonster.attack_spe += player.inventory[i].value
			case "defense":
				player.currentMonster.defense += player.inventory[i].value
			case "attack_spe":
				player.currentMonster.defense_spe += player.inventory[i].value
			case "speed":
				player.currentMonster.speed += player.inventory[i].value
		}
		return action_item_stat(player, "player", player.inventory[i].target, player.inventory[i].type)
	}
}