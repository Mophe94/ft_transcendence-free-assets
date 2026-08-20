import { IsArray, IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class UpdateAllStatsDto {
  @IsArray()
  @IsString({ each: true })
  monsterCatch: string[];

  @IsBoolean()
  win: boolean;

  @IsBoolean()
  lose: boolean;

  @IsInt()
  @Min(0)
  playerDefeated: number;

  @IsString()
  asset: string;
}