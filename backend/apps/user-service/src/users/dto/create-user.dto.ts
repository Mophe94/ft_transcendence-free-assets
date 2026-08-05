import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({ message: 'Email is missing' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password should at least be 8 characters long.' })
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
