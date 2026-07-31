import type { Player } from "../../../Player";
import { new_encounter } from "../../send/map/new_encounters";

const table_catch = {
	commun: 60,
	uncommun: 30,
	rare: 10
}

// RECEIVED REQUEST FOR MONSTER IN THIS TILE, CALL DB GAME + CHOICE ONE RANDOM MONSTER BASED ON THERE RARITY VALUE AND RETURN THIS
export function received_new_encounter(player: Player, tile: string){
	let result = Math.floor(Math.random() * 101);
	// call monster from db
	if (result <= table_catch.rare){ /* && monster.rarity == rare exist*/
		result = Math.floor(Math.random() * 101);
		let table_monster: string[] = [ "coucou", "salut", "heyhey" ]
		// remplir table monster avec les nom des pq en rare
		let gap = Math.floor(101 / table_monster.length)
		let step = gap
		let i = 0
		for (i; result > gap && i < table_monster.length - 1; ++i)
			gap += step
		player.current_monster = table_monster[i]
		player.current_monster_rarity = "rare"
	}
	else if (result <= table_catch.uncommun){ /* && monster.rarity == uncommun exist*/
		result = Math.floor(Math.random() * 101);
		let table_monster: string[] = [ "coucou", "salut", "heyhey" ]
		// remplir table monster avec les nom des pq en uncommun
		let gap = Math.floor(101 / table_monster.length)
		let step = gap
		let i = 0
		for (i; result > gap && i < table_monster.length - 1; ++i)
			gap += step
		player.current_monster = table_monster[i]
		player.current_monster_rarity = "uncommun"
	}
	else {
		result = Math.floor(Math.random() * 101);
		let table_monster: string[] = [ "coucou", "salut", "heyhey" ]
		// remplir table monster avec les nom des pq en commun
		let gap = Math.floor(101 / table_monster.length)
		let step = gap
		let i = 0
		for (i; result > gap && i < table_monster.length - 1; ++i)
			gap += step
		player.current_monster = table_monster[i]
		player.current_monster_rarity = "commun"
	}
	
	return new_encounter(player);
}