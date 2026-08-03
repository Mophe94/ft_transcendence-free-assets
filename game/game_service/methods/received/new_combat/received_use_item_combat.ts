import type { Player } from "../../../Player";
import { action_battle } from "../../send/new_combat/action_battle";
import { received_pass } from "./received_pass";

export function received_use_item_combat(player: Player, enemy: Player, item: string){
	let i: number = 0
	for (i; i < player.inventory.length; ++i){
		if (player.inventory[i]["name"] === item){
			break;
		}
	}
	if (i >= player.inventory.length || player.inventory[i]["current"] <= 0){
		received_pass(player)
		return
	}

	let current_item = player.inventory[i]
	const type = current_item.type
	switch (type) {
		case "heal":
			let result_heal = current_item.value
			let temp_life_heal = player.currentMonster.life.current
			player.currentMonster.life.current += current_item.value;
			if (player.currentMonster.life.current > player.currentMonster.life.max){
				result_heal = player.currentMonster.life.max - temp_life_heal
				player.currentMonster.life.current = player.currentMonster.life.max
			}
			player.text = player.name + " use " + item + " for heal " + player.currentMonster.name + " of " + result_heal + " hp."
			break;

		case "damage":
			let result_damage = current_item.value
			let temp_life_damage = enemy.currentMonster.life.current
			enemy.currentMonster.life.current -= current_item.value;
				if (enemy.currentMonster.life.current <= 0){
					result_damage = temp_life_damage
					enemy.currentMonster.life.current = 0
				}
			player.text = player.name + " use " + item + " on " + enemy.currentMonster.name + " and deal " + result_damage + " damage."
			break;

		case "stat_down":
			switch (current_item.target){
				case "attack":
					enemy.currentMonster.attack -= current_item.value
					break;
				case "attack_spe":
					enemy.currentMonster.attack_spe -= current_item.value
					break;
				case "defense":
					enemy.currentMonster.defense -= current_item.value
					break;
				case "defense_spe":
					enemy.currentMonster.defense_spe -= current_item.value
					break;
				case "speed":
					enemy.currentMonster.speed -= current_item.value
					break;
				default:
					received_pass(player)
					return
			}
			player.text = player.name + " use " + item + " on " + enemy.currentMonster.name + ", " + current_item.target + " stat down."
			break;
		
		case "stat_up":
			switch (current_item.target){
				case "attack":
					player.currentMonster.attack += current_item.value
					break;
				case "attack_spe":
					player.currentMonster.attack_spe += current_item.value
					break;
				case "defense":
					player.currentMonster.defense += current_item.value
					break;
				case "defense_spe":
					player.currentMonster.defense_spe += current_item.value
					break;
				case "speed":
					player.currentMonster.speed += current_item.value
					break;
				default:
					received_pass(player)
					return
			}
			player.text = player.name + " use " + item + " on " + player.currentMonster.name + ", " + current_item.target + " stat up."
			break;

		default:
			received_pass(player)
			return
	}

	current_item["current"] -= 1
		if (current_item["current"] === 0){
			current_item["name"] = ""
			current_item["scene"] = ""
			current_item["target"] = ""
			current_item["type"] = ""
			current_item["value"] = 0
		}
}