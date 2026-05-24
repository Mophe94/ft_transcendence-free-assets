export interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    username: string;
    email: string;
    avatarUrl: string;
  };
}
