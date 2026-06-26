import { UserRole } from "./userRole.enum";

export interface FortyTwoUser {
  fortyTwoId: number;
  username: string;
  email: string;
  avatarUrl: string;
  created_at?: Date;
  role: UserRole;
}
