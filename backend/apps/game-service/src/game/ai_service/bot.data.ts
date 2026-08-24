export const BOT_TEAM_TIERS = {
  faible: [
    ['pisciner', 'squirel', 'burpy', 'leafs'],
    ['pisciner', 'fishet', 'papate', 'fishet'],
    ['pisciner', 'squirel', 'fishet', 'leafs'],
  ],
  fort: [
     ['squirel', 'squirel', 'leafs', 'fishet', 'papate', 'gigantomakia'],
     ['leafs', 'squirel', 'leafs', 'fishet', 'monkel', 'pigeonne'],
     ['fishet', 'squirel', 'leafs', 'burpy', 'fishet', 'sharky'],
  ],
} as const;

export type BotTeamTier = keyof typeof BOT_TEAM_TIERS;

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

export const BOT_ITEMS: Record<string, { scene: string; type: string; value: number }> = {
  potion: { scene: 'combat', type: 'heal', value: 50 },
  bomb: { scene: 'combat', type: 'damage', value: 50 },
};

export const BOT_ITEM_COUNTS: Record<BotTeamTier, { potion: number; bomb: number }> = {
  faible: { potion: 1, bomb: 0 },
  fort: { potion: 2, bomb: 1 },
};

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