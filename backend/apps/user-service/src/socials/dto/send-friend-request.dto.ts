import { IsNotEmpty, IsString } from 'class-validator';

export class SendFriendRequestDto {
  @IsNotEmpty({ message: 'Identifier is missing' })
  @IsString({ message: 'Not a string' })
  destinatory!: string;
}
