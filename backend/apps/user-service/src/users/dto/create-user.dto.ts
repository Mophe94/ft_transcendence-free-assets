import {
  IsEmail,
  IsNotEmpty,
  IsNotIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

const FORBIDDEN = [
  'admin',
  'administrator',
  'system',
  'root',
  'moderator',
  'support',
];

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid Email' })
  @MaxLength(50, { message: 'Mail is max 50 chars.' })
  @IsNotEmpty({ message: 'Email is missing' })
  email!: string;

  @IsString()
  @Length(8, 20, {
    message: 'Password should be between 8 and 20 characters long.',
  })
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  @Length(3, 10, { message: 'Username should be between 3 and 10 chars' })
  @IsNotIn(FORBIDDEN, { message: 'Forbidden username' })
  username?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
