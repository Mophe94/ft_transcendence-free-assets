import { new_encounter } from "./new_encounters";
import { Player } from "../player/player";

// RECEIVED REQUEST FOR MONSTER IN THIS TILE, CALL DB GAME + CHOICE ONE RANDOM MONSTER BASED ON THERE RARITY VALUE AND RETURN THIS
export function received_new_encounter(player: Player, tile: string){
	let monster: string = ""
	//demande object existant +++++ monster = name of item select
	player.current_monster = monster
	// catch = catch du monstre
	//player.current_monster_catch = 0
	return new_encounter(player);
}