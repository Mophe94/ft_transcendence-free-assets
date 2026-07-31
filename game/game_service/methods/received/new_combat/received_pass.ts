import type { Player } from "../../../Player";
import { action_battle } from "../../send/new_combat/action_battle";

export function received_pass(player: Player, order: number){
    player.text = player.name + " pass for this turn."

    return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
}