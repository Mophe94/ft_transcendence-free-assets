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
  faible: [
    ['pisciner', 'squirel', 'burpy'],
  ],
  fort: [
     ['fishet', 'squirel', 'leafs', 'burpy', 'papate', 'gigantomakia'],
  ],
} as const;

export type BotTeamTier = keyof typeof BOT_TEAM_TIERS;

/**
 * Type de chaque monstre, tel que défini en DB. Fixe, donc pas besoin
 * d'interroger MonstersService depuis l'IA juste pour ça.
 */
export const MONSTER_TYPES: Record<string, string> = {
  pisciner: 'neutral',
  fishet: 'water',
  burpy: 'water',
  sharky: 'water',
  squirel: 'neutral',
  papate: 'earth',
  gigantomakia: 'earth',
  monkel: 'neutral',
  pigeonne: 'fly',
  leafs: 'plant',
};

/**
 * Métadonnées des seuls objets que le bot sait utiliser (potion = soin,
 * bomb = dégâts). golden ticket (capture, phase map uniquement) et rage
 * (bonus de stat) ne sont pas pertinents pour une IA de combat simple.
 */
export const BOT_ITEMS: Record<string, { scene: string; type: string; value: number }> = {
  potion: { scene: 'combat', type: 'heal', value: 50 },
  bomb: { scene: 'combat', type: 'damage', value: 50 },
};

/**
 * Quantité de chaque objet selon le palier du round (feature 3 étendue
 * aux objets) : plus on avance dans le bracket, plus le bot est équipé.
 */
export const BOT_ITEM_COUNTS: Record<BotTeamTier, { potion: number; bomb: number }> = {
  faible: { potion: 1, bomb: 1 },
  fort: { potion: 2, bomb: 2 },
};

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
  'Ginette',
  'Josiane',
  'Chantal',
  'Monique',
] as const;

/**
 * Skins disponibles côté Godot (voir SKINS dans le front). Un bot en
 * pioche un au hasard à sa création, pour ne pas toujours afficher le
 * même sprite.
 */
export const BOT_SKINS: ReadonlyArray<string> = [
  'dinoGreen',
  'dinoBlue',
  'dinoRed',
  'dinoYellow',
  'ghost',
  'ghost02',
  'ghost03',
  'satyr01',
  'satyr02',
  'satyr03',
];