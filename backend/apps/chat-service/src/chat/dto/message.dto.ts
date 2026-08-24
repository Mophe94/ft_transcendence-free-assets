import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500, { message: 'Message should be max 500 chars.' })
  content!: string;
}
