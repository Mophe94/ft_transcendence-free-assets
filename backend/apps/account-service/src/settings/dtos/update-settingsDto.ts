import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsString()
  @IsNotEmpty()
  theme!: string;

  @IsNumber()
  starter!: number;
}
