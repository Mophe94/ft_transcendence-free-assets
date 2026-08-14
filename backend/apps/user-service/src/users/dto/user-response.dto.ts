export class Settings {
  skin!: string;
  theme!: string;
  starter!: string;
}

export class UserResponseDto {
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
  id!: string;
  email!: string;
  username!: string;
  avatarUrl!: string;
  coalitionId!: number;
  settings!: Settings;
  createdAt!: Date;
  updatedAt!: Date;
}
