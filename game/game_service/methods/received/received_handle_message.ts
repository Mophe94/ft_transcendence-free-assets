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
import { result_battle } from "../send/new_combat/result_battle";
import { change_monster } from "../send/new_combat/change_monster";
import { new_turn } from "../send/new_combat/new_turn";

function has_valid_monsters(player: Player): boolean {
    for (const monster of player.battle_team) {
        if (monster.name !== "" && monster.life.current > 0) {
            return true;
        }
    }
    return false;
}

export interface PlayerActions {
    [playerId: number]: {
        actionType: "try_attack" | "use_item_combat" | "change_current_monster" | "pass";
        data: any;
    }
}

export let currentActions: PlayerActions = {};

export function handle_message(player: Player, player2: Player, msg: any){
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
			if (currentActions[player.id] && currentActions[player2.id]) {
                const arrResult = resolving_battle_round(player, player2, currentActions);
				delete currentActions[player.id];
                delete currentActions[player2.id];
				if (arrResult && Array.isArray(arrResult)){
					for (let i = 0; i < arrResult.length; ++i){
						let packet = arrResult[i]
						// send packet to player1 and player2
					}
					if (player.currentMonster.life.current <= 0){
						if (!has_valid_monsters(player)){
							send result_battle(player, player2.id)
							send result_battle(player2, player2.id)
							// wainting all combat finish
						}
						else{
							send change_monster(player, player.id)
							send change_monster(player2, player.id)
						}
					}
					else if (player2.currentMonster.life.current <= 0){
						if (!has_valid_monsters(player2)){
							send result_battle(player, player.id)
							send result_battle(player2, player.id)
						}
						else{
							send change_monster(player, player2.id)
							send change_monster(player2, player2.id)
						}
					}
//					else if (!has_valid_monsters(player2)){
//						send result_battle(player, player.id)
//						send result_battle(player2, player.id)
//					}
					else{
						send new_turn(player)
						send new_turn(player2)
						// si un combat deja finish declenchement du roundLeft
						// send new_turn(player, rounLeft)
						// send new_turn(player, roundLeft)
					}
				}
            }
			break;
		
		default:
			console.log("Unknow state:", msg.data.state)
			return undefined
	}
	return result
}
