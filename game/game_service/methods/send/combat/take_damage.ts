import { Player } from "../../../Player";

export function take_damage(player: Player, skill: string){
    return {
        event: "game",
        data: {
            state: "take_damage",
            attack: skill,
            player: {
                currentMonster: player.currentMonster
            }
        }
    }
}