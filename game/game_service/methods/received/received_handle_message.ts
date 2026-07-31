import type { Player } from "../../Player";

import { received_team_choice } from "./temSetup/received_team_choice";

import { received_add_item } from "./map/received_add_item";
import { received_delete_item } from "./map/received_delete_item"
import { received_delete_monster } from "./map/received_delete_monster";
import { received_new_encounter } from "./map/received_new_encounter";
import { received_request_item } from "./map/received_request_item";
import { received_try_catch } from "./map/received_try_catch";
import { received_use_item } from "./map/received_use_item";
import { resolving_battle_round } from "./new_combat/resolving_battle_round";
import { action_battle } from "../send/new_combat/action_battle";

export interface PlayerActions {
    [playerId: number]: {
        actionType: "try_attack" | "use_item_combat" | "change_current_monster" | "pass";
        data: any;
    }
}

export let currentActions: PlayerActions = {};

export function handle_message(player: Player, enemy: Player, msg: any){
	let result: object | undefined
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
			result = received_try_catch(player)
			break;
		case "delete_monster":
			result = received_delete_monster(player, msg.data?.monster)
			break;


		case "team_choice":
			result = received_team_choice(player, msg.data?.battle_team)
			break;
		

        case "change_current_monster":
        case "use_item_combat":
        case "try_attack":
		case "pass":
			currentActions[player.id] = {
                actionType: state,
                data: msg.data
            };
			if (currentActions[player.id] && currentActions[enemy.id]) {
                result = resolving_battle_round(player, enemy, currentActions);
				delete currentActions[player.id];
                delete currentActions[enemy.id];
            }
			break;
		
		default:
			console.log("Unknow state:", msg.data.state)
			return
	}
	return result
}
