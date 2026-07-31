import { Player } from "../../../Player";
import { result_battle } from "../../send/new_combat/result_battle";
import { PlayerActions } from "../received_handle_message";
import { received_change_current_monster } from "./received_change_current_monster";
import { received_pass } from "./received_pass";
import { received_try_attack } from "./received_try_attack";
import { received_use_item_combat } from "./received_use_item_combat";


function has_valid_monsters(player: Player): boolean {
    for (const monster of player.battle_team) {
        if (monster.name !== "" && monster.life.current > 0) {
            return true;
        }
    }
    return false;
}


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
            return received_try_attack(player, enemy, actionPlayer.data?.skill, order)
        case "use_item_combat":
            return received_use_item_combat(player, enemy, actionPlayer.data?.item, order)
        case "change_current_monster":
            return received_change_current_monster(player, actionPlayer.data?.slot, order)
        case "pass":
            return received_pass(player, order)
        default:
           return received_pass(player, order)
    }
}

export function resolving_battle_round(player1: Player, player2: Player, action: PlayerActions){
    const actionPlayer1 = action[player1.id];
    const actionPlayer2 = action[player2.id];

    let first: Player = resolve_first(player1, player2, actionPlayer1, actionPlayer2)
    let second: Player = first ? player2 : player1

    let first_action = handle_action(first, second, action[first.id], 1)
    if (second.currentMonster.life.current <= 0) {
        second.currentMonster.life.current = 0;
        if (!has_valid_monsters(second)) {
            return { [player1.id]: result_battle(first, first.id),
                [player2.id]: result_battle(second, first.id) }
            };
    }

    let second_action = handle_action(second, first, action[second.id], 2)
    if (first.currentMonster.life.current <= 0) {
        first.currentMonster.life.current = 0;
        if (!has_valid_monsters(first)) {
            return { [first.id]: result_battle(first, second.id),
                [second.id]: result_battle(second, second.id) }
            };
    }
    // si change monster envoyer 
    return { [player1.id]: first === player1 ? first_action : second_action,
                [player2.id]: first === player1 ? first_action : second_action }
}