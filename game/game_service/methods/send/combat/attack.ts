import type { Player } from "../../../Player";

export function attack(player: Player, enemy: Player, result: boolean, skill: string){
    return {
        event: "game",
        data: {
            state: "attack",
            attack: skill,
            enemy: {
                currentMonster: enemy.currentMonster
            }
        }
    }
}