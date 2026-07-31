import { Player } from "../../../Player";
import { CurrentMonster, Skill } from "../../../type/interfaces";
import { action_battle } from "../../send/new_combat/action_battle";

const typeChart: Record<string, Record<string, number>> = {
	"fire":  { "plant": 2, "water": 0.5, "neutral": 1, "earth": 1 },
	"water":  { "fire": 2, "plant": 0.5, "earth": 0.5, "neutral": 1 },
	"earth": { "water": 2, "fire": 0.5, "plant": 0.5, "neutral": 1 },
	"plant": { "water": 2, "earth": 2, "neutral": 1, "fire": 0.5 },
	"neutral": { "water": 1, "fire": 1, "plant": 1, "earth": 1 }
 }


export function	received_try_attack(player: Player, enemy: Player, skillName: string, order: number) {
	const skill = player.currentMonster.skill.find(s => s.name === skillName);
	if (enemy == null || enemy.currentMonster == null || skill == null || skill.current <= 0){
		if (skill == null){
			player.text = player.name + " pass for this turn."
			return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
		}
		else{
			player.text = player.currentMonster.name + " fail to use " + skillName
			return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
		}
	}

	let i: number = 0
	let touch: number = 0
	let resultDamage: number = 0
	let effectiveness: string = ""
	switch (skill.effect) {
		case "damage":
			if (enemy.currentMonster.dodge === true){
					player.text = player.currentMonster.name + " use " + skillName + " on " + enemy.currentMonster.name + " but he dodge."
					enemy.currentMonster.dodge = false
			}
			else{
				player.text = player.currentMonster.name + " use " + skillName + " on " + enemy.currentMonster.name
				while (i++ < skill.repetition){
					if (enemy.currentMonster.life.current <= 0) {
    				    break;
    				} 
					const attackSuccess: boolean = successAttackCalculation(skill, enemy.currentMonster)
					if (attackSuccess === false){
						if (skill.repetition === 1){
							player.text = enemy.currentMonster.name + " dodge " + skillName + "."
							return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
						}
						else
							continue
					}
					touch++
					const resultAttack = attackResult(player, skill.type, enemy, enemy.currentMonster.type, player.currentMonster.type);
					if (resultAttack.result >= enemy.currentMonster.life.current)
						resultAttack.result = enemy.currentMonster.life.current
					if (effectiveness != "")
						effectiveness = resultAttack.effectiveness
					resultDamage += resultAttack.result
					enemy.currentMonster.life.current -= resultAttack.result
				}
				if (skill.repetition > 1)
					if (skill.repetition > 1){
						if (resultDamage > 0)
							player.text += " and hit " + touch + " times for " + resultDamage + " damage"
						else
							player.text = enemy.currentMonster.name + " dodge " + skillName + " " + touch + " times."
					}
				else
					player.text += " for " + resultDamage + " damage"
			}
			player.text += effectiveness
			break;

		case "up_stat":
			const target_up = skill.data
			switch (target_up) {
				case "defense":
					player.currentMonster.defense += skill.value
					break;
				case "speed":
					player.currentMonster.speed += skill.value
					break;
				case "attack":
					player.currentMonster.attack += skill.value
					break;
				case "attack_spe":
					player.currentMonster.attack_spe += skill.value
					break;
				
				default:
					player.text = player.name + " pass for this turn."
					return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
			}
			player.text = player.currentMonster.name + " use " + skillName + " and up his " + target_up;
			break;

		case "down_stat":
			const target_down = skill.data
			switch (target_down) {
				case "defense":
					if (enemy.currentMonster.defense <= 0){
						player.text = player.currentMonster.name + " use " + skillName + " but " + enemy.currentMonster.name + " " + target_down + " are already minimum."
					}
					else{
						player.text = player.currentMonster.name + " use " + skillName + " and down " + enemy.currentMonster.name + " " + target_down + "."
						enemy.currentMonster.defense -= skill.value
					}
					break;

				case "speed":
					if (enemy.currentMonster.speed <= 0){
						player.text = player.currentMonster.name + " use " + skillName + " but " + enemy.currentMonster.name + " " + target_down + " are already minimum."
					}
					else{
						player.text = player.currentMonster.name + " use " + skillName + " and down " + enemy.currentMonster.name + " " + target_down + "."
						enemy.currentMonster.speed -= skill.value
					}
					break;

				case "attack":
					if (enemy.currentMonster.attack <= 0){
						player.text = player.currentMonster.name + " use " + skillName + " but " + enemy.currentMonster.name + " " + target_down + " are already minimum."
					}
					else{
						player.text = player.currentMonster.name + " use " + skillName + " and down " + enemy.currentMonster.name + " " + target_down + "."
						enemy.currentMonster.attack -= skill.value
					}
					break;

				case "attack_spe":
					if (enemy.currentMonster.attack_spe <= 0){
						player.text = player.currentMonster.name + " use " + skillName + " but " + enemy.currentMonster.name + " " + target_down + " are already minimum."
					}
					else{
						player.text = player.currentMonster.name + " use " + skillName + " and down " + enemy.currentMonster.name + " " + target_down + "."
						enemy.currentMonster.attack_spe -= skill.value
					}
					break;

				default:
					player.text = player.name + " pass for this turn."
					return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
			}
			break;
		
		case "dodge":
			player.currentMonster.dodge = true
			player.text = player.currentMonster.name + " use " + skillName + " and are ready to dodge next attack."
			break;

		default:
			player.text = player.name + " pass for this turn."
			return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
	}
	return order === 1 ? action_battle(player, 1, 1) : action_battle(player, 2, 1)
}


function successAttackCalculation(skill: Skill, enemyMonster: CurrentMonster): boolean{
	let result = Math.floor(Math.random() * 101);
	result -= enemyMonster.speed / 10
	if (result < skill.precision)
		return false
	return true
}


function attackResult(player: Player, attackType: string, enemy:Player, enemyType: string, monsterType: string,){

	let flatAttackDammage: number = player.currentMonster["attack"]
	if (attackType == monsterType)
		flatAttackDammage = player.currentMonster["attack_spe"]
	let effectiveness: string = ".";
	
	let  multi: number = typeChart[attackType]?.[enemyType] ?? 1;
	if (multi >= 2)
		effectiveness = ". It's super effectiveness !";
	else if (multi <= 0.5)
		effectiveness = ". It's not effectiveness.";
	let result = Math.trunc(flatAttackDammage * multi);
	if (monsterType == enemyType)
		result -= enemy.currentMonster.defense_spe;
	else
		result -= enemy.currentMonster.defense;
	if (result <= 0)
		result = 0;
	return { result, effectiveness }
}