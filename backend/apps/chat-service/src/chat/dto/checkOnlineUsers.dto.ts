import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator/types';
import { Type } from 'class-transformer';

export class CheckOnlineUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnlineUserDto)
  users!: Array<OnlineUserDto>;
}

export class OnlineUserDto {
  @IsString({ message: 'Id is not a string' })
  @IsNotEmpty({ message: 'Empty Id' })
  id!: string;

  @IsString({ message: 'Username is not a string' })
  @IsNotEmpty({ message: 'Empty Id' })
  username!: string;

  @IsInt({ message: 'CoalitionId not a number' })
  coalitionId!: number;

  @IsString({ message: 'Avatar is not a string' })
  avatarUrl!: string;

  @IsBoolean({ message: 'IsOnline is not a boolean' })
  isOnline!: boolean;
}
