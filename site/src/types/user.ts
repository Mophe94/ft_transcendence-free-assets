export interface Settings {
    id: number;
    theme: string;
    starter: number;
}

export interface Stats {
    id: number;
    total_damage_given: number;
    total_damage_received: number;
    nb_victories: number;
    nb_defeats: number;
    nb_fights: number;
    nb_monsters_discovered: number;
    nb_objects_discovered: number;
    nb_achievements: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatarUrl: string;
    created_at: Date;
    settings?: Settings;
    stats?: Stats;
    role: string;
}