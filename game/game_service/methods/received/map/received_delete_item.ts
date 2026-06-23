import type { Player } from "../../../Player";
import { update_inventory } from "../../send/map/update_inventory";

// // DELETE ITEM + SEND UPDATE_ITEM
export function received_delete_item(player: Player, item: string){
	for (let i = 0; i < player.inventory.length; ++i){
		if (player.inventory[i]["name"] === item){
			player.inventory[i]["current"] -= 1;
			if (player.inventory[i]["current"] == 0){
				player.inventory[i]["name"] = "";
				player.inventory[i]["scene"] = "";
				player.inventory[i]["type"] = "";
				player.inventory[i]["target"] = "";
				player.inventory[i]["value"] = 0;
			}
			break;
		}
	}
	return update_inventory(player);
}