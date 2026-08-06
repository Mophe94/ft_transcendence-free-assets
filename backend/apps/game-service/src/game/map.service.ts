import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Player } from './player/player';
import { MonstersService } from './entities/monsters.service';
import { TilesService } from './entities/tiles.service';
import { ItemsService } from './entities/items.service';


@Injectable()
export class MapService {

	// HANDLERS
	  
	  // RECEIVED REQUEST FOR MONSTER IN THIS TILE, CALL DB GAME + CHOICE ONE RANDOM MONSTER BASED ON THERE RARITY VALUE AND RETURN THIS
	  private async received_new_encounter(player: Player, tile: string){
		const table_encounter = {
		  common: 65,
		  uncommon: 25,
		  rare: 10
		}
		// Retrieve list monsters by tile
		const tileObject = await this.tilesService.findOneByType(tile);
		if (!tileObject) {
		  console.log("tileObject is undefined");
		  return undefined;
		}
		const tileId = tileObject.id;
	
		let table_monster = await this.monstersService.findMonstersByTile(tileId);
		if (!table_monster) {
		  console.log("table_monster is undefined");
		  return undefined;
		}
	
		// random rarity
		let result = Math.floor(Math.random() * 100);
		let rarity: string;
	
		if (result <= table_encounter.rare) {
		  rarity = 'rare'
		}
		else if (result <= table_encounter.uncommon) {
		  rarity = 'uncommon'
		}
		else {
		  rarity = 'common'
		}
	
		let selected_monsters: string[] = [];
		for (let i = 0; i < table_monster.length; i++) {
		  if (table_monster[i].rarity === rarity)
			  selected_monsters.push(table_monster[i].name);
		}
	
		if (selected_monsters.length === 0) {
		  console.log(`No monster of rarity ${rarity} found on tile ${tile}`);
		  return undefined
		}
	
		const selected_monster = selected_monsters[Math.floor(Math.random() * selected_monsters.length)];
	
		player.current_monster = selected_monster;
		player.current_monster_rarity = rarity;
	
		return this.new_encounter(player);
	  }
	
	  private received_delete_monster(player: Player, monster: string) {
		for (let i = 0; i < player.team.length; ++i) {
		  if (player.team[i] === monster) { 
			player.team[i] = '';
			break;
		  }
		}
		return this.update_team(player);
	  }
	  
	  // CHECK MATCH OF MONSTER WITH RANDOM VALUE AND RETURN TRUE IF OK OR FALSE
	  private received_try_catch(player: Player, item?: string){
		const table_catch = {
		  common: 75,
		  uncommon: 45,
		  rare: 20
		}
		let result: number = 0
	  
		if (item === undefined)
		  result = Math.floor(Math.random() * 100);
	  
		let monsterCatch: number = 0
	 
		monsterCatch = table_catch[player.current_monster_rarity as keyof typeof table_catch]
		if (monsterCatch !== undefined) {
		  if (result <= monsterCatch) {
			  for (let i = 0; i < player.team.length; ++i) {
				  if (player.team[i] === '') {
					player.team[i] = player.current_monster;
					return this.result_catch(player, 1);
				  }
			  }
		  }
		  else 
			return this.result_catch(player, 0);
		}
		else
		  return this.result_catch(player, 0);
	  }
	
	  // CHECK TEAM SENDED AND IF IT'S EMPTY, ELSE AUTO FULLY BATTLE_TEAM IF IT'S POSSIBLE
	  // WHEN BATTLE_TEAM OK CALL DB GAME AND RETURN COMBAT
	  private async received_team_choice(
		player: Player,
		monsters: string[],
	  ): Promise<object | undefined> {
		const monstersToLoad: {name: string; slot: number}[] = []; //arr objects
		let count = 0;
	
		for (let i = 0; i < monsters.length; i++) {
		  if (monsters[i] !== "") {
			count ++;
		  }
		}
	
		if (count === 0) {
		  for (let i = 0; i < player.team.length && count <= 2; i++) {
			if (player.team[i] !== "") {
			  monstersToLoad.push({
				name: player.team[i],
				slot: count,
			  });
			  count++;
			}
		  }
		}
		else {
		  for (let i = 0; i < monsters.length && monstersToLoad.length < 3; i++) {
			for (let j = 0; j < player.team.length; j++) {
			  if (monsters[i] !== "" && monsters[i] === player.team[j]) {
				monstersToLoad.push({
				  name: player.team[j],
				  slot: monstersToLoad.length,
				})
				break;
			  }
			}
		  }
		}
	
	
		for (const {name, slot} of monstersToLoad) {
		  const monster = await this.monstersService.findOneByName(name, { skills: true });
		  if (!monster) return {
			event: 'game',
			data: { state: 'team_choice', reason: 'invalid_monster', monster: name },
		  }
		  player.battle_team[slot] = {
			name: monster.name,
			slot: slot,
			life: {
			  current: monster.hp_total,
			  max: monster.hp_total,
			},
			type: String(monster.type),
			attack: monster.attack,
			attack_spe: monster.attack_spe,
			defense: monster.defense,
			defense_spe: monster.defense_spe,
			speed: monster.speed,
			status: [],
			dodge: false, // missing in DB
			skill: monster.skills.slice(0, 4).map((skill): PlayerSkill => ({
			  name: skill.name,
			  current: skill.power_point,
			  max: skill.power_point,
			  type: skill.type,
			  effect: skill.effect,
			  repetition: skill.repetition,
			  precision: skill.precision,
			  data: skill.data,
			  value: skill.value,
			}))
		  };
		}
		await new Promise(resolve => setTimeout(resolve, 1000)); // ! temp fix to synchronizeke with startCombatTimer
		return this.combat(player);
	  }
	
	
	  // RECEIVED REQUEST FOR ITEM, CALL DB GAME + CHOICE ONE RANDOM ITEM AND RETURN THIS
	   private async received_request_item(player: Player){
		let items = await this.itemsService.findAll();
		if (!items) {
		  console.log('[ERROR]: items is undefined')
		  return undefined
		}
	
		let result = Math.floor(Math.random() * 100);
		let gap = Math.floor(100 / items.length)
		let step = gap
		let i = 0
		for (i; result > gap && i < items.length - 1; ++i)
		  gap += step
		player.current_item = items[i].name;
		
		let add = false;
		for (let i = 0; i < player.inventory.length; ++i){
		  if (player.inventory[i]["name"] === player.current_item) {
			player.inventory[i]["current"] += 1;
			add = true;
		  }
		}
		if (add === false) {
		  for (let j = 0; i < player.inventory.length; j++) {
			if (player.inventory[j]["name"] === ""){
			  player.inventory[j]["name"] = player.current_item;
			  player.inventory[j]["scene"] = items[i].scene;
			  player.inventory[j]["current"] += 1;
			  player.inventory[j]["value"] = items[i].value;
			  player.inventory[j]["target"] = items[i].target;
			  break;
			}
		 }
		}
		return this.new_current_item(player);
	  }
	
	  // ADD ITEM + RETURN UPDATE_ITEM
	  private received_add_item(player: Player){
		player.current_item = "";
		return this.update_inventory(player);
	  }
	
	
	  // CALL REMOVE ITEM + ADD MONSTER IN TEAM + SEND RESULT_CATCH WITH UPDATE_TEAM
	  private received_use_item(player: Player, item: string){
		const userId = this.playerService.getUserId(player);
		if (!userId)
		  return undefined;
		this.sendToPlayer(userId, this.received_delete_item(player, item));
	
		for (let i = 0; i < player.team.length; ++i){
		  if (player.team[i] === "") {
		  player.team[i] = player.current_monster;
		  break;
		  }
		}
		return this.result_catch(player, 1);
	  }
	
	  // JSON RESPONSE
	  async start_game(player: Player) {
		// return {
		//   event: 'game',
		//   data: {
		//     state: 'start_game',
		//     player: {
		//       id: player.id,
		//       name: player.name,
		//       asset: player.asset,
		//       team: player.team,
		//     },
		//     timer: player.timer,
		//     current_map: player.current_map,
		//   },
		// };
		//const monster = await this.initMonster(player, 2/* payload.data.monsterId */);
		return {
		  event: 'game',
		  data: {
			state: 'start_game',
			player: {
			  id: player.id,
			  name: 'Ce que tu veux',
			  asset: 'dinoBlue',
			  team: player.team,
			  //monster: player.currentMonster.name,
			},
			timer: player.timer,
			current_map: 'map_01',
		  },
		};
	  }
	
	  private new_encounter(player: Player) {
		return {
		  event: 'game',
		  data: {
			state: 'new_encounter',
			current_monster: player.current_monster,
		  },
		};
	  }
	
	  private result_catch(player: Player, result: number, monsterFlee?: number) {
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
	
	  private update_inventory(player: Player) {
		return {
		  event: 'game',
		  data: {
			state: 'update_inventory',
			player: {
			  inventory: player.inventory,
			},
		  },
		};
	  }
	
	  private new_current_item(player: Player) {
		return {
		  event: 'game',
		  data: {
			state: 'new_current_item',
			current_item: player.current_item,
		  },
		};
	  }
	
		// // DELETE ITEM + SEND UPDATE_ITEM
	  private received_delete_item(player: Player, item: string){
		for (let i = 0; i < player.inventory.length; ++i){
		  if (player.inventory[i]["name"] === item){
			if (player.inventory[i].current === 1) {
			  player.inventory[i]["name"] = "";
			  player.inventory[i]["scene"] = "";
			  player.inventory[i]["type"] = "";
			  player.inventory[i]["target"] = "";
			  player.inventory[i]["value"] = 0;
			  player.inventory[i]["current"] = 0;
			}
			else 
			  player.inventory[i].current -= 1;
	
			}
			break;
		  }
		return this.update_inventory(player);
	  }
	
	  private update_team(player: Player) {
		return {
		  event: 'game',
		  data: {
			state: 'update_team',
			player: {
			  team: player.team,
			},
		  },
		};
	  }
	
	  private team_setup(player: Player, enemy: Player) {
		return {
		  event: 'game',
		  data: {
			state: 'team_setup',
			timer: player.timer,
			player: {
			  team: player.team,
			},
			enemy: {
			  id: enemy.id,
			  name: enemy.name,
			  asset: enemy.asset,
			  team: enemy.team,
			},
		  },
		};
	  }
	
	  private combat(player: Player) {
		return {
		  event: 'game',
		  data: {
			state: 'combat',
			timer: player.timer,
			player: {
			  battle_team: player.battle_team,
			},
		  },
		};
	  }
	
	
	}

}