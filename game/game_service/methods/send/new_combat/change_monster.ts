import type { Player } from "../../../Player";

export function change_monster(player: Player, id: number){
	let result = {
		event: "game",
		data: {
			state: "",
			player: player,
			time: 0
		}
	}
	
	if (id != player.id){
		player.text = "Wait for your opponent to switch monsters"
		result.data.state = "enemy_change_monster"
	}
	else{
		player.text = player.currentMonster.name + " has died. Change your monster"
		result.data.state = "change_monster"
	}

	return result
}