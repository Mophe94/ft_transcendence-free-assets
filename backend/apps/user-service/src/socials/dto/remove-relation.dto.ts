import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveRelationDto {
  @IsUUID('4', { message: 'Invalid target user ID format' })
  @IsNotEmpty()
  id!: string;
}
