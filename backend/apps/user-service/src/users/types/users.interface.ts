import { UserRole } from './userRole.enum';
import { UserSettings } from './userSettings.interface';

export interface User {
  email: string;
  username: string;
  passwordHash: string;
  avatarUrl: string;
  coalitionId: number;
  settings: UserSettings;
  userRoles: UserRole[];
}
