import type { Player } from "../../../Player";

export function	attack(this: Player, enemy: Player, attackName: string) {
	const skill = this.currentMonster.skill.find(s => s.name === attackName);
	if (enemy == null || skill == null || skill.current <= 0)
		return {
			event: "game",
			data: {
				type: "attackResult",
				text: this.currentMonster.name + " fail to use " + attackName
			}
		}

	const resultAttack = attackResult(skill.type, enemy.currentMonster.type, this.currentMonster.type);
	if (resultAttack.result >= enemy.currentMonster.life.current)
		resultAttack.result = enemy.currentMonster.life.current
	let lifeLeft: number = enemy.currentMonster.life.current - resultAttack.result;
	return {
		event: "game",
		data: {
			state: "attackResult",
			text: this.currentMonster.name + " use " + attackName + " on " + enemy.currentMonster.name + resultAttack.effectiveness
		}
	}
}

 const typeChart: Record<string, Record<string, number>> = {
     "fire":  { "plant": 2, "water": 0.5, "neutral": 1 },
     "water":  { "fire": 2, "plant": 0.5, "earth": 0.5, "neutral": 1 },
     "earth": { "water": 2, "fire": 0.5, "plant": 0.5, "neutral": 1 },
 	"plant": { "water": 2, "earth": 2, "neutral": 1 },
 	"neutral": { "water": 1, "fire": 1, "plant": 1, "earth": 1 }
 };
 function attackResult(attackType: string, enemyType: string, monsterType: string){
 //	ask for attack and attack_spe
 //	attack = 0 but attack = attack
 // if attackType == monsterType
//		attack = attackspe
 	let effectiveness: string = ".";
 	let flatAttackDammage: number = 0
	let  multi: number = typeChart[attackType]?.[enemyType] ?? 1;
 	if (multi >= 2)
 		effectiveness = " it's super effectiveness !";
 	else if (multi <= 0.5)
 		effectiveness = " it's not effectiveness.";
 	let result = Math.trunc(flatAttackDammage * multi);
 	return { result, effectiveness }
 };