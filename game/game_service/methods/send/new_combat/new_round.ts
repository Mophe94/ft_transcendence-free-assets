import { Player } from "../../../Player";

export function new_round(){
        return {
        event: "game",
        data: {
            state: "new_round",
            timer: 0
        }
    }
}