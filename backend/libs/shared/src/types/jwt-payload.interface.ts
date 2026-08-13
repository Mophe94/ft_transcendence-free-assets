export interface JwtPayload {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
  roles: string[];
}
