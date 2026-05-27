import { Settings } from 'src/settings/settings.entity';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    settings: Settings;
  };
}
