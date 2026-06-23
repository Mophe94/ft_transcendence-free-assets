import type { Player } from "../../../Player";
import { new_current_item } from "../../send/map/new_current_item";

// RECEIVED REQUEST FOR ITEM, CALL DB GAME + CHOICE ONE RANDOM ITEM AND RETURN THIS
export function received_request_item(player: Player){
	let item: string = ""
	//demande object existant +++++ item = name of item select
	player.current_item = item
	return new_current_item(player);
}