import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Player } from './player/player';
import {
  CurrentActions,
  CurrentMonster,
  Skill,
} from './player/player.interfaces';

@Injectable()
export class CombatService {
  // combatRoomId -> [userIdA, userIdB]
  combatRooms = new Map<string, [string, string]>();
  // userId -> combatRoomId
  playerCombatRoom = new Map<string, string>();

  // Called when a room in GameService reaches FULL state
  matchmake(rooms: Set<string>): void {
    const players = [...rooms];

    while (players.length >= 2) {
      const indexA = Math.floor(Math.random() * players.length);
      const [userIdA] = players.splice(indexA, 1);

      const indexB = Math.floor(Math.random() * players.length);
      const [userIdB] = players.splice(indexB, 1);

      const combatRoomId = randomUUID();
      this.combatRooms.set(combatRoomId, [userIdA, userIdB]);
      this.playerCombatRoom.set(userIdA, combatRoomId);
      this.playerCombatRoom.set(userIdB, combatRoomId);
    }

    if (players.length === 1) {
      console.log(`[CombatService] ${players[0]} left without an opponent `);
    }
  }

  getOpponentId(userId: string): string | undefined {
    const combatRoomId = this.playerCombatRoom.get(userId);
    if (!combatRoomId) return undefined;
    const [userIdA, userIdB] = this.combatRooms.get(combatRoomId)!;
    return userIdA === userId ? userIdB : userIdA;
  }
  /* ********************************************************************* */

  /* RESOLVING BATTLE ROUND - RECEIVED */
  private resolve_first(player1: Player, player2: Player): Player {
    const speed1 = player1.currentMonster['speed'];
    const speed2 = player2.currentMonster['speed'];

    if (
      player1.currentActions.actionType === player2.currentActions.actionType
    ) {
      if (speed1 === speed2) {
        return Math.random() < 0.5 ? player1 : player2;
      }
      return speed1 > speed2 ? player1 : player2;
    }

    if (
      player1.currentActions.actionType === 'pass' ||
      player2.currentActions.actionType === 'pass'
    ) {
      return player1.currentActions.actionType === 'pass' ? player1 : player2;
    }

    if (
      player1.currentActions.actionType === 'change_current_monster' ||
      player2.currentActions.actionType === 'change_current_monster'
    ) {
      return player1.currentActions.actionType === 'change_current_monster'
        ? player1
        : player2;
    }

    if (
      player1.currentActions.actionType === 'use_item_combat' ||
      player2.currentActions.actionType === 'use_item_combat'
    ) {
      return player1.currentActions.actionType === 'use_item_combat'
        ? player1
        : player2;
    }

    return player1;
  }

  handle_action(
    player: Player,
    enemy: Player,
    actionPlayer: CurrentActions,
    order: number,
  ) {
    switch (actionPlayer.actionType) {
      case 'try_attack':
        this.received_try_attack(player, enemy, actionPlayer.data?.skill);
        break;
      case 'use_item_combat':
        this.received_use_item_combat(player, enemy, actionPlayer.data?.item);
        break;
      case 'change_current_monster':
        this.received_change_current_monster(player, actionPlayer.data?.slot);
        break;
      case 'pass':
        this.received_pass(player);
        break;
      default:
        this.received_pass(player);
    }
  }

  // Helper
  private pushResult(
    map: Map<string, Array<Object>>,
    playerId: string,
    result: Object,
  ): void {
    const arr = map.get(playerId);
    if (arr) arr.push(result);
    else map.set(playerId, [result]);
  }

  resolving_battle_round(
    player1: Player,
    player2: Player,
  ): Map<string, Array<Object>> {
    let map_result = new Map<string, Array<Object>>();
    let first: Player = this.resolve_first(player1, player2);
    let second: Player = first === player1 ? player2 : player1;

    const actionFirst = first.currentActions;
    const actionSecond = second.currentActions;

    let changeMonsterFirst: string | undefined = undefined;
    let changeMonsterSecond: string | undefined = undefined;

    if (actionFirst.actionType == 'change_current_monster')
      changeMonsterFirst = first.id;

    // 1
    this.handle_action(first, second, actionFirst, 1);

    second.text = first.text;
    let temp1 = new Player(first.id, first.name, first.asset);
    Object.assign(temp1, first);
    let temp2 = new Player(second.id, second.name, second.asset);
    Object.assign(temp2, second);

    this.pushResult(
      map_result,
      first.id,
      this.action_battle(temp1, temp2, 1, 1, changeMonsterFirst),
    );
    this.pushResult(
      map_result,
      second.id,
      this.action_battle(temp2, temp1, 1, 1, changeMonsterFirst),
    );

    if (
      (second.currentMonster.name !== '' &&
        second.currentMonster.life.current <= 0) ||
      first.forceChooseMonster
    ) {
      if (first.forceChooseMonster) {
        first.forceChooseMonster = false;
      }
      return map_result;
    }

    // 2
    if (actionSecond.actionType == 'change_current_monster')
      changeMonsterSecond = second.id;

    this.handle_action(second, first, actionSecond, 2);

    first.text = second.text;

    this.pushResult(
      map_result,
      first.id,
      this.action_battle(first, second, 2, 2, changeMonsterSecond),
    );
    this.pushResult(
      map_result,
      second.id,
      this.action_battle(second, first, 2, 2, changeMonsterSecond),
    );

    return map_result;
  }

  /* SEND */
  action_battle(
    player: Player,
    player2: Player,
    order: number,
    max: number,
    changePlayerID?: string,
  ) {
    let result = {
      event: 'game',
      data: {
        state: 'action_battle',
        order: order,
        max: max,
        change_monster: '-1',
        player: player,
        enemy: player2,
      },
    };
    if (changePlayerID && changePlayerID !== undefined)
      result.data.change_monster = changePlayerID;
    return result;
  }

  result_battle(player: Player, win_id: string) {
    let result = {
      event: 'game',
      data: {
        state: '',
      },
    };
    if (player.id === win_id) result.data.state = 'win';
    else result.data.state = 'lose';

    return result;
  }

  change_monster(player: Player, id: string) {
    let result = {
      event: 'game',
      data: {
        state: '',
        player: player,
        time: 0,
      },
    };

    if (id != player.id) {
      player.text = 'Wait for your opponent to switch monsters';
      result.data.state = 'enemy_change_monster';
    } else {
      player.text =
        player.currentMonster.name + ' has died. Change your monster';
      result.data.state = 'change_monster';
    }

    return result;
  }

  new_turn(player: Player, roundLeft?: number) {
    let result = {
      event: 'game',
      data: {
        state: 'new_turn',
        timer: player.timer,
        player: player,
      },
    };
    if (roundLeft !== undefined)
      result.data.player.text =
        'The fight will end in ' + String(roundLeft) + ' rounds.';
    else result.data.player.text = '';
    return result;
  }

  next_map(player: Player) {
    return {
      event: 'game',
      data: {
        state: 'next_map',
        timer: player.timer,
        current_map: 'map_01', //player.current_map,
        player: player,
      },
    };
  }

  /* RECEIVED ACTIONS */

  readonly typeChart: Record<string, Record<string, number>> = {
    fire: { plant: 2, water: 0.5, neutral: 1, earth: 1, fly: 1 },
    water: { fire: 2, plant: 0.5, earth: 0.5, neutral: 1, fly: 1 },
    earth: { water: 2, fire: 0.5, plant: 0.5, neutral: 1, fly: 1 },
    plant: { water: 2, earth: 2, neutral: 1, fire: 0.5, fly: 0.5 },
    neutral: { water: 1, fire: 1, plant: 1, earth: 1, fly: 1 },
    fly: { water: 1, fire: 1, plant: 2, earth: 0.5, neutral: 1 },
  };

  private received_try_attack(
    player: Player,
    enemy: Player,
    skillName: string,
  ) {
    const skill = player.currentMonster.skill.find((s) => s.name === skillName);
    if (
      enemy == null ||
      enemy.currentMonster == null ||
      skill == null ||
      skill.current <= 0
    ) {
      if (skill == null) {
        this.received_pass(player);
        return;
      } else {
        player.text = player.currentMonster.name + ' fail to used ' + skillName;
        return;
      }
    }

    let i: number = 0;
    let touch: number = 0;
    let resultDamage: number = 0;
    let effectiveness: string = '.';
    skill.current -= 1;
    switch (skill.effect) {
      case 'damage':
        if (enemy.currentMonster.dodge === true) {
          player.text =
            player.currentMonster.name +
            ' used ' +
            skillName +
            ' on ' +
            enemy.currentMonster.name +
            ' but he dodge.';
          enemy.currentMonster.dodge = false;
        } else {
          player.text =
            player.currentMonster.name +
            ' used ' +
            skillName +
            ' on ' +
            enemy.currentMonster.name;
          while (i++ < skill.repetition) {
            if (enemy.currentMonster.life.current <= 0) {
              break;
            }
            const attackSuccess: boolean = this.successAttackCalculation(
              skill,
              enemy.currentMonster,
            );
            if (attackSuccess === false) {
              if (skill.repetition == 1) {
                player.text =
                  enemy.currentMonster.name + ' dodge ' + skillName + '.';
                return;
              } else {
                continue;
              }
            }
            touch++;
            const resultAttack = this.attackResult(
              player,
              skill.type,
              enemy,
              enemy.currentMonster.type,
              player.currentMonster.type,
            );
            if (resultAttack.result >= enemy.currentMonster.life.current)
              resultAttack.result = enemy.currentMonster.life.current;
            if (resultAttack.effectiveness != '') effectiveness = resultAttack.effectiveness;
            resultDamage += resultAttack.result;
            enemy.currentMonster.life.current -= resultAttack.result;
          }
          if (skill.repetition > 1) {
            if (resultDamage > 0)
              player.text +=
                ' and hit ' +
                touch +
                ' times for ' +
                resultDamage +
                ' damage';
            else
              player.text =
                enemy.currentMonster.name +
                ' dodge ' +
                skillName +
                ' ' +
                touch +
                ' times.';
          } else player.text += ' for ' + resultDamage + ' damage';
        }
        player.text += effectiveness;
        break;

      case 'up_stat':
        const target_up = skill.data;
        switch (target_up) {
          case 'defense':
            player.currentMonster.defense += skill.value;
            break;
          case 'speed':
            player.currentMonster.speed += skill.value;
            break;
          case 'attack':
            player.currentMonster.attack += skill.value;
            break;
          case 'attack_spe':
            player.currentMonster.attack_spe += skill.value;
            break;
          default:
            this.received_pass(player);
        }
        player.text =
          player.currentMonster.name +
          ' used ' +
          skillName +
          ' to boost its ' +
          target_up;
        break;

      case 'down_stat':
        const target_down = skill.data;
        switch (target_down) {
          case 'defense':
            if (enemy.currentMonster.defense <= 0) {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' but ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                ' won\'t go any lower.';
            } else {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' and decreased ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                '.';
              enemy.currentMonster.defense -= skill.value;
            }
            break;

          case 'speed':
            if (enemy.currentMonster.speed <= 0) {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' but ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                ' won\'t go any lower.';
            } else {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' and decreased ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                '.';
              enemy.currentMonster.speed -= skill.value;
            }
            break;

          case 'attack':
            if (enemy.currentMonster.attack <= 0) {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' but ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                ' won\'t go any lower.';
            } else {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' and decreased ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                '.';
              enemy.currentMonster.attack -= skill.value;
            }
            break;

          case 'attack_spe':
            if (enemy.currentMonster.attack_spe <= 0) {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' but ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                ' won\'t go any lower.';
            } else {
              player.text =
                player.currentMonster.name +
                ' used ' +
                skillName +
                ' and decreased ' +
                enemy.currentMonster.name +
                ' ' +
                target_down +
                '.';
              enemy.currentMonster.attack_spe -= skill.value;
            }
            break;
          default:
            this.received_pass(player);
            return;
        }
        break;

      case 'dodge':
        player.currentMonster.dodge = true;
        player.text =
          player.currentMonster.name +
          ' used ' +
          skillName +
          ' and are ready to dodge the next attack.';
        break;
      default:
        this.received_pass(player);
        return;
    }
  }

  //received_change_current_monster helper
  private successAttackCalculation(
    skill: Skill,
    enemyMonster: CurrentMonster,
  ): boolean {
    let result = Math.floor(Math.random() * 100);
    result += (enemyMonster.speed / 10);
    if (result > skill.precision) return false;
    return true;
  }

  //received_change_current_monste helper
  private attackResult(
    player: Player,
    attackType: string,
    enemy: Player,
    enemyType: string,
    monsterType: string,
  ) {
    let flatAttackDammage: number = player.currentMonster['attack'];
    if (attackType == monsterType)
      flatAttackDammage = player.currentMonster['attack_spe'];
    let effectiveness: string = '.';

    let multi: number = this.typeChart[attackType]?.[enemyType] ?? 1;
    if (multi >= 2) effectiveness = ". It's super effective !";
    else if (multi <= 0.5) effectiveness = ". It's not very effective..";
    let result = Math.trunc(flatAttackDammage * multi);
    if (attackType == enemyType) result -= enemy.currentMonster.defense_spe;
    else result -= enemy.currentMonster.defense;
    if (result <= 0) result = 0;
    return { result, effectiveness };
  }

  private received_use_item_combat(
    player: Player,
    enemy: Player,
    item: string,
  ) {
    let i: number = 0;
    for (i; i < player.inventory.length; ++i) {
      if (player.inventory[i]['name'] === item) {
        break;
      }
    }
    if (i >= player.inventory.length || player.inventory[i]['current'] <= 0) {
      this.received_pass(player);
      return;
    }

    let current_item = player.inventory[i];
    current_item.current -= 1;
    const type = current_item.type;
    switch (type) {
      case 'heal':
        console.log('3 type: ', type);
        let result_heal = current_item.value;
        let temp_life_heal = player.currentMonster.life.current;
        player.currentMonster.life.current += current_item.value;
        if (
          player.currentMonster.life.current > player.currentMonster.life.max
        ) {
          result_heal = player.currentMonster.life.max - temp_life_heal;
          player.currentMonster.life.current = player.currentMonster.life.max;
        }
        player.text =
          player.name +
          ' used ' +
          item +
          ' on ' +
          player.currentMonster.name +
          ' and restored ' +
          result_heal +
          ' HP.';
        break;

      case 'damage':
        console.log('3 type: ', type);
        let result_damage = current_item.value;
        let temp_life_damage = enemy.currentMonster.life.current;
        enemy.currentMonster.life.current -= current_item.value;
        if (enemy.currentMonster.life.current <= 0) {
          result_damage = temp_life_damage;
          enemy.currentMonster.life.current = 0;
        }
        player.text =
          player.name +
          ' used ' +
          item +
          ' on ' +
          enemy.currentMonster.name +
          ' and dealt ' +
          result_damage +
          ' damage.';
        break;

      case 'stat_down':
        console.log('3 type: ', type);
        switch (current_item.target) {
          case 'attack':
            enemy.currentMonster.attack -= current_item.value;
            break;
          case 'attack_spe':
            enemy.currentMonster.attack_spe -= current_item.value;
            break;
          case 'defense':
            enemy.currentMonster.defense -= current_item.value;
            break;
          case 'defense_spe':
            enemy.currentMonster.defense_spe -= current_item.value;
            break;
          case 'speed':
            enemy.currentMonster.speed -= current_item.value;
            break;
          default:
            this.received_pass(player);
            return;
        }
        player.text =
          player.name +
          ' used ' +
          item +
          ' on ' +
          enemy.currentMonster.name +
          ' to lower ' +
          current_item.target +
          '.';
        break;

      case 'stat_up':
        console.log('3 type: ', type);
        switch (current_item.target) {
          case 'attack':
            player.currentMonster.attack += current_item.value;
            break;
          case 'attack_spe':
            player.currentMonster.attack_spe += current_item.value;
            break;
          case 'defense':
            player.currentMonster.defense += current_item.value;
            break;
          case 'defense_spe':
            player.currentMonster.defense_spe += current_item.value;
            break;
          case 'speed':
            player.currentMonster.speed += current_item.value;
            break;
          default:
            this.received_pass(player);
            return;
        }
        player.text =
          player.name +
          ' used ' +
          item +
          ' on ' +
          player.currentMonster.name +
          ', ' +
          current_item.target +
          ' increased.';
        break;

      default:
        console.log('3 type: ', type);
        this.received_pass(player);
        return;
    }

    current_item['current'] -= 1;
    if (current_item['current'] === 0) {
      current_item['name'] = '';
      current_item['scene'] = '';
      current_item['target'] = '';
      current_item['type'] = '';
      current_item['value'] = 0;
    }
  }

  private received_change_current_monster(player: Player, slot: number) {
    let temp = '';
    if (player.currentMonster.name !== '') temp = player.currentMonster.name;
    if (
      player.currentMonster.name === '' &&
      slot >= 0 &&
      slot <= 2 &&
      player.battle_team[slot]['name'] != '' &&
      player.battle_team[slot]['life']['current'] > 0
    ) {
      player.currentMonster = player.battle_team[slot];
      player.text = player.name + ' call ' + player.currentMonster.name;
    } else if (
      slot >= 0 &&
      slot <= 2 &&
      player.battle_team[slot]['name'] != '' &&
      player.battle_team[slot]['life']['current'] > 0
    ) {
      player.currentMonster = player.battle_team[slot];
      if (temp !== '')
        player.text =
          player.name +
          ' change ' +
          temp +
          ' for ' +
          player.currentMonster.name;
    } else {
      for (let i = 0; i < player.battle_team.length; ++i) {
        if (
          player.battle_team[i]['name'] != '' &&
          player.battle_team[i]['life']['current'] != 0
        ) {
          player.currentMonster = player.battle_team[i];
          player.text =
            player.name + ' change ' + temp + ' for ' + player.currentMonster;
          break;
        }
      }
    }
    //		console.log("PLAYER text: ", player.text);
  }

  private received_pass(player: Player) {
    player.text = player.name + ' pass for this turn.';
  }
}
