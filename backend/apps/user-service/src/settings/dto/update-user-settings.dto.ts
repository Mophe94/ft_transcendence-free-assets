import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsIn(['light', 'dark'], {
    message: 'Theme must be either "light" or "dark"',
  })
  theme?: 'light' | 'dark';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  starter?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  skin?: string;
}
