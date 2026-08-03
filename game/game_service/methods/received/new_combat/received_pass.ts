import type { Player } from "../../../Player";

export function received_pass(player: Player){
    player.text = player.name + " pass for this turn."
}