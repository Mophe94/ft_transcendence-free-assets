import { IsNotEmpty, IsUUID } from 'class-validator';

export class AcceptFriendRequestDto {
  @IsUUID('4', { message: 'Invalid requester ID format' })
  @IsNotEmpty()
  id!: string;
}
