import { Player } from "../../../Player";
import { action_battle } from "../../send/new_combat/action_battle";
import { result_battle } from "../../send/new_combat/result_battle";
import { change_monster } from "../../send/new_combat/change_monster";
import { PlayerActions } from "../received_handle_message";
import { received_change_current_monster } from "./received_change_current_monster";
import { received_pass } from "./received_pass";
import { received_try_attack } from "./received_try_attack";
import { received_use_item_combat } from "./received_use_item_combat";


function resolve_first(player1: Player, player2: Player, actionPlayer1: PlayerActions[number], actionPlayer2: PlayerActions[number]): Player {
    const speed1 = player1.currentMonster["speed"];
    const speed2 = player2.currentMonster["speed"];

    if (actionPlayer1.actionType === actionPlayer2.actionType){
       if (speed1 === speed2) {
            return Math.random() < 0.5 ? player1 : player2;
        }
        return speed1 > speed2 ? player1 : player2;
    }

    if(actionPlayer1.actionType === "pass" || actionPlayer2.actionType === "pass"){
        return actionPlayer1.actionType === "pass" ? player1 : player2
    }

    if (actionPlayer1.actionType === "change_current_monster" || actionPlayer2.actionType === "change_current_monster"){
        return actionPlayer1.actionType === "change_current_monster" ? player1 : player2
    }

    if (actionPlayer1.actionType === "use_item_combat" || actionPlayer2.actionType === "use_item_combat"){
        return actionPlayer1.actionType === "use_item_combat" ? player1 : player2
    }

    return player1
}


function handle_action(player: Player, enemy: Player, actionPlayer: PlayerActions[number], order: number){
    switch (actionPlayer.actionType) {
        case "try_attack":
            received_try_attack(player, enemy, actionPlayer.data?.skill)
            break
        case "use_item_combat":
            received_use_item_combat(player, enemy, actionPlayer.data?.item)
            break
        case "change_current_monster":
            received_change_current_monster(player, actionPlayer.data?.slot)
            break
        case "pass":
            received_pass(player)
            break
        default:
           received_pass(player)
    }
}

export function resolving_battle_round(player1: Player, player2: Player, action: PlayerActions){
    const actionPlayer1 = action[player1.id]
    const actionPlayer2 = action[player2.id]

    let first: Player = resolve_first(player1, player2, actionPlayer1, actionPlayer2)
    let second: Player = first === player1 ? player2 : player1
    let changeMonsterFirst: number | undefined = undefined;
    let changeMonsterSecond: number | undefined = undefined;

    if (action[first.id].actionType == "change_current_monster")
        changeMonsterFirst = first.id 

    handle_action(first, second, action[first.id], 1)
    if (second.currentMonster.life.current <= 0) {
        second.currentMonster.life.current = 0
		return [ action_battle(first, second,  1, 1, changeMonsterFirst)
		]
	}

    if (action[second.id].actionType == "change_current_monster")
        changeMonsterSecond = second.id 

    handle_action(second, first, action[second.id], 2)

    // si change monster envoyer 
    return [ action_battle(first, second, 1, 2, changeMonsterFirst),
        action_battle(second, first, 2, 2, changeMonsterSecond)
    ]
}