import { UserRole } from './userRole.enum';

export interface FortyTwoUser {
  fortyTwoId: number;
  username: string;
  email: string;
  coalition_id: number;
  coalition_name: string;
  avatarUrl: string;
  created_at?: Date;
  role: UserRole;
}
