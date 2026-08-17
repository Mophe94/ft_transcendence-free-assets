export interface StatDb {
  user_id: string;
  games_played: number;
  games_won: number;
  games_lost: number;
  total_player_defeated: number;
  monsters_discovered: string[];
  nb_monsters_discovered: number;
  endings_discovered: string[];
  nb_endings_discovered: number;
  achievements: string[];
  nb_achievements: number;
}