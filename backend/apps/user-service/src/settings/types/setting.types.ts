import { UserSettings } from '../../users/types/userSettings.interface';

export interface RawUpdateResult {
  settings: UserSettings;
  updated_at: Date;
}
