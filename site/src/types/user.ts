export interface Settings {
  skin: string;
  theme: string;
  starter: string;
  avatar: string 
}

export interface UserStats {
  userId: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  totalPlayerDefeated: number;
  monstersDiscovered: string[];
  nbMonstersDiscovered: number;
  endingsDiscovered: string[];
  nbEndingsDiscovered: number;
  achievements: string[];
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
