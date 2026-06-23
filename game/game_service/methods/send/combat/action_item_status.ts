import type { Player } from "../../../Player";

export function action_item_stat(player: Player, charactere: string, stat: string, change: string){
     return {
        event: "game",
        data: {
            state: "action_item_stat",
            target: charactere,
            stat: stat,
			change: change	 
        }
    }
}