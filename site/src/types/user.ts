export interface Settings {
  skin: string;
  theme: string;
  starter: string;
}

export interface UserStats {
  totalDamageDealt: number;
  totalDamageReceived: number;
  gamesWon: number;
  gamesLost: number;
  gamesPlayed: number;
  nbMonstersDiscovered: number;
  nbObjectsDiscovered: number;
  nbAchievements: number;
}

export interface User {
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
  settings?: Settings;
  coalitionId: number;
}
