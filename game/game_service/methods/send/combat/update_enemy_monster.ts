import type { Player } from "../../../Player"

    
export function	update_enemy_monster(player: Player, enemy: Player) {
    return {
        event: "game",
        data: {
            state: "update_enemy_monster",
            enemy: {
                currentMonster: enemy.currentMonster,
                battle_team: enemy.battle_team
            },
        }
    }
}