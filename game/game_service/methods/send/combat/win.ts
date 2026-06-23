import type { Player } from "../../../Player";

export function win(player: Player, enemy: Player, result: boolean, skill: string){
    return {
        event: "game",
        data: {
            state: "win",
        }
    }
}