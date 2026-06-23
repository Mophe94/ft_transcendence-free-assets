import type { Player } from "../../../Player";

export function battle_start(player: Player, enemy: Player){
    return {
        event: "game",
		data: {
			state: "battle_start",
            timer: player.timer,
            player: {
                currentMonster: player.currentMonster
            },
            enemy: {
                currentMonster: enemy.currentMonster
            }
        }
    }
}