import type { Player } from "../../Player";
import { received_update_current_monster } from "./combat/received_change_current_monster";
import { received_use_item_combat } from "./combat/received_use_item_combat";
import { received_try_attack } from "./combat/received_try_attack";

import { received_team_choice } from "./temSetup/received_team_choice";

import { received_add_item } from "./map/received_add_item";
import { received_delete_item } from "./map/received_delete_item"
import { received_delete_monster } from "./map/received_delete_monster";
import { received_new_encounter } from "./map/received_new_encounter";
import { received_request_item } from "./map/received_request_item";
import { received_try_catch } from "./map/received_try_catch";
import { received_use_item } from "./map/received_use_item";

export function handle_message(player: Player, enemy: Player, msg: any){
	let result: object
	const state = msg?.data?.state
	switch (state) {
		case "add_item":
			result = received_add_item(player)
			break;
		case "delete_item":
			result = received_delete_item(player, msg.data?.item)
			break;
		case "item_request":
			result = received_request_item(player)
			break;
		case "use_item":
			result = received_use_item(player, msg.data?.item)
			break;
		case "new_encounter":
			result = received_new_encounter(player, msg.data?.tile)
			break;
		case "try_catch":
			received_try_catch(player)
			break;
		case "delete_monster":
			received_delete_monster(player, msg.data?.monster)
			break;

			
		case "team_choice":
			received_team_choice(player, msg.data?.battle_team)
			break;


		case "change_current_monster":
			received_update_current_monster(player, msg.data?.slot)
			break;
		case "use_item_combat":
			received_use_item_combat(player, enemy, msg.data?.item)
			break;
		case "try_attack":
			received_try_attack(player, enemy, msg.data?.skill)
			break;
		
		default:
			console.log("Unknow state:", msg.data.state)
			return
	}
	//send result
}
