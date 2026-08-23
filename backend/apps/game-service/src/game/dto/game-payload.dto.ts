import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import {
  IsIn,
  IsString,
  IsArray,
  ArrayMaxSize,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  validateSync,
} from 'class-validator';
import { GameData } from '../game.type';

/**
 * Whitelist of `state` values accepted on the 'game' WS channel.
 * Anything outside this list is rejected before it reaches GameService.
 */
export enum GameState {
  AddItem = 'add_item',
  DeleteItem = 'delete_item',
  ItemRequest = 'item_request',
  UseItem = 'use_item',
  NewEncounter = 'new_encounter',
  TryCatch = 'try_catch',
  DeleteMonster = 'delete_monster',
  TeamChoice = 'team_choice',
  ChangeCurrentMonster = 'change_current_monster',
  UseItemCombat = 'use_item_combat',
  TryAttack = 'try_attack',
  Pass = 'pass',
  SafeToContinue = 'safe_to_continue',
}

/**
 * Base class: every payload must have a `state` field within the whitelist.
 */
abstract class BaseGameDto {
  @IsIn(Object.values(GameState))
  state!: GameState;
}

// --- Payloads with no extra data (just `state`) ---
class AddItemDto extends BaseGameDto {}
class ItemRequestDto extends BaseGameDto {}
class TryCatchDto extends BaseGameDto {}
class PassDto extends BaseGameDto {}
class SafeToContinueDto extends BaseGameDto {}

// --- Payloads with a single `item`/`monster`/`tile` field (bounded resource name) ---
class DeleteItemDto extends BaseGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  item!: string;
}

class UseItemDto extends BaseGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  item!: string;
}

class NewEncounterDto extends BaseGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  tile!: string;
}

class DeleteMonsterDto extends BaseGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  monster!: string;
}

// --- team_choice: array of monster names, bounded in size ---
class TeamChoiceDto extends BaseGameDto {
  @IsArray()
  @ArrayMaxSize(6) // team + battle_team never exceed 6 slots in the current game
  @IsString({ each: true })
  battle_team!: string[];
}

// --- Combat actions: one relevant field per action, typed and bounded ---
class TryAttackDto extends BaseGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  skill!: string;
}

class UseItemCombatDto extends BaseGameDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  item!: string;
}

class ChangeCurrentMonsterDto extends BaseGameDto {
  @IsInt()
  @Min(0)
  @Max(2) // battle_team is a 3-slot array (slots 0-2)
  slot!: number;
}

/**
 * Maps each state to its expected DTO. Single place to update when a new
 * state is added on the GameService side.
 */
const DTO_BY_STATE: Record<GameState, new () => BaseGameDto> = {
  [GameState.AddItem]: AddItemDto,
  [GameState.ItemRequest]: ItemRequestDto,
  [GameState.TryCatch]: TryCatchDto,
  [GameState.Pass]: PassDto,
  [GameState.SafeToContinue]: SafeToContinueDto,
  [GameState.DeleteItem]: DeleteItemDto,
  [GameState.UseItem]: UseItemDto,
  [GameState.NewEncounter]: NewEncounterDto,
  [GameState.DeleteMonster]: DeleteMonsterDto,
  [GameState.TeamChoice]: TeamChoiceDto,
  [GameState.TryAttack]: TryAttackDto,
  [GameState.UseItemCombat]: UseItemCombatDto,
  [GameState.ChangeCurrentMonster]: ChangeCurrentMonsterDto,
};

/**
 * Validates a raw payload received on the 'game' WS channel.
 *
 * - Rejects anything that isn't a plain object (string, array, null, number...).
 * - Rejects any `state` that is missing or outside the whitelist.
 * - Rejects any field that is missing, mistyped, or EXTRA (forbidNonWhitelisted)
 *   relative to the DTO expected for that state -> prevents injecting arbitrary
 *   properties into player.currentActions.data.
 *
 * Never throws: returns `null` on an invalid payload, leaving it to the caller
 * to log/ignore rather than crash the connection.
 */
export function validateGamePayload(raw: unknown): GameData | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return null;
  }

  const state = (raw as Record<string, unknown>).state;
  if (typeof state !== 'string' || !(state in DTO_BY_STATE)) {
    return null;
  }

  const DtoClass = DTO_BY_STATE[state as GameState];
  const instance = plainToInstance(DtoClass, raw);

  const errors = validateSync(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    return null;
  }

  return instance as unknown as GameData;
}