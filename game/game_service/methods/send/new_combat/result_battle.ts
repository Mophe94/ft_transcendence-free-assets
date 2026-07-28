import { Player } from "../../../Player"

export function result_battle(player: Player, win_id: number){
    let result = {
        event: "game",
        data: {
            state: "",
            player: player
        }
    }
    if (player.id === win_id)
        result.data.state = "win"
    else
        result.data.state = "lose"

    return result
}