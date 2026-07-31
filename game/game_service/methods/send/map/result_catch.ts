import type { Player } from "../../../Player";

export function result_catch(player: Player, result: number, monsterFlee?: number) {
    let success: number = 0
	let msg = {
        event: "game",
        data: {
            state: "result_catch",
            success: "",
            player: {
				team: result !== 0 ? player.team : undefined
			},
        }
    };

	if (result == 1){
		msg.data.success = "ok"
		return msg
	}
	else{
		let flee = Math.floor(Math.random() * 101);
		if (flee < 50)
			msg.data.success = "flee"
		else
			msg.data.success = "fail"
		return msg
	}
}