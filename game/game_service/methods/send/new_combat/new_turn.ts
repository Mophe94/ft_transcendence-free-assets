import { Player } from "../../../Player";

export function new_turn(player: Player, roundLeft?: number){
        let result = {
        event: "game",
        data: {
            state: "new_turn",
            timer: player.timer,
            player: player
        }
    }
    if (roundLeft !== undefined)
        result.data.player.text = "The fight will end in " + String(roundLeft) + " rounds."
    else
        result.data.player.text = ""
    return result
}