import type { Player } from "../../../Player";
import { update_inventory } from "../../send/map/update_inventory";

// ADD ITEM + RETURN UPDATE_ITEM
export function received_add_item(player: Player){
	for (let i = 0; i < player.inventory.length; ++i){
		if (player.inventory[i]["name"] === ""){
			player.inventory[i]["name"] = player.current_item;
			player.inventory[i]["current"] = 1;
			//call pour scene et value et target
			break;
		}
		else if (player.inventory[i]["name"] === player.current_item){
			player.inventory[i]["current"] += 1;
			break;
		}
	}
	return update_inventory(player);
}