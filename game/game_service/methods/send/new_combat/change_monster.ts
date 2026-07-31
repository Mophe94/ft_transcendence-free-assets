import type { Player } from "../../../Player";

export function change_monster(player: Player, id: number){
	if (id == player.id)
		player.text = "Wait for your opponent to switch monsters"
	else
		player.text = player.currentMonster.name + " has died. Change your monster"
	
	let result = {
		event: "game",
		data: {
			state: "enemy_change_monster",
			player: player
		}
	}

	if (id == player.id)
		result.data.state = "enemy_change_monster"
	else
		result.data.state = "enemy_change_monster"

	return result
}