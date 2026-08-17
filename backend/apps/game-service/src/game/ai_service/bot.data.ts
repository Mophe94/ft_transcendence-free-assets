/**
 * Catalogue des équipes de bot.
 *
 * Chaque équipe contient 6 noms de monstres existants en DB (comme le
 * champ `team` d'un joueur humain). C'est `received_team_choice`
 * (map.service.ts) qui ira chercher les vraies stats en DB au moment du
 * team_setup — on ne stocke ici que des noms, jamais de stats.
 *
 * 3 paliers, basés sur les rareté déjà définies en DB (common / uncommon /
 * rare), pour que l'équipe se renforce avec l'avancement dans le bracket
 * (feature 3) sans jamais toucher aux stats des monstres. Chaque palier
 * contient plusieurs équipes possibles pour éviter que le bot pioche
 * toujours la même composition.
 */
export const BOT_TEAM_TIERS = {
  // Round(s) de début : 0 ou 1 rare max
  faible: [
    ['fishet', 'squirel', 'leafs', 'burpy', 'papate', 'monkel'], // aucun rare
    ['sharky', 'squirel', 'leafs', 'burpy', 'papate', 'monkel'], // variante eau
    ['fishet', 'squirel', 'leafs', 'burpy', 'papate', 'gigantomakia'], // variante terre
    ['fishet', 'squirel', 'leafs', 'burpy', 'pigeonne', 'monkel'], // variante air
  ],

  // Round(s) intermédiaires : 2 rares
  moyen: [
    ['sharky', 'gigantomakia', 'leafs', 'burpy', 'papate', 'monkel'],
    ['sharky', 'pigeonne', 'fishet', 'leafs', 'papate', 'monkel'],
    ['gigantomakia', 'pigeonne', 'fishet', 'squirel', 'burpy', 'monkel'],
  ],

  // Round(s) de fin : les 3 rares
  fort: [
    ['sharky', 'gigantomakia', 'pigeonne', 'burpy', 'papate', 'monkel'], // full uncommon+rare
    ['sharky', 'gigantomakia', 'pigeonne', 'fishet', 'squirel', 'leafs'], // full common+rare
    ['sharky', 'gigantomakia', 'pigeonne', 'burpy', 'squirel', 'leafs'], // mix
  ],
} as const;

export type BotTeamTier = keyof typeof BOT_TEAM_TIERS;

/**
 * Pool of names for hardcoded bots. There will never be more bots in a
 * single room than there are names here (a room caps at FULL players,
 * and a bot only fills the missing slots) — so 7 is comfortably enough,
 * no need to generate hundreds of names.
 */
export const BOT_NAMES = [
  'Didier',
  'Thierry',
  'Bernard',
  'Gérard',
  'Roger',
  'Jean-Michel',
  'Kevin',
] as const;