import type { Player } from "../../../Player";

export function action_battle(player: Player, player2: Player, order: number, max: number, changePlayerID?: number){
	player2.text = player.text
    let result = {  event: "game",
        data: {
            state: "action_battle",
			order: order,
			max: max,
            changeMonster: -1,
            player: player,
            enemy: player2
        }
    }
    if (changePlayerID && changePlayerID !== undefined)
        result.data.changeMonster = changePlayerID
    return result
}