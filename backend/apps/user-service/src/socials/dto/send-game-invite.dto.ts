import { IsNotEmpty, IsString } from 'class-validator';

export class SendGameInviteDto {
  @IsNotEmpty({ message: 'Identifier is missing' })
  @IsString({ message: 'RoomId not a string' })
  destinatory!: string;

  @IsNotEmpty({ message: 'RoomId is missing' })
  @IsString({ message: 'RoomId not a string' })
  roomId!: string;
}
