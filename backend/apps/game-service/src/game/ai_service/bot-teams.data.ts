import { CurrentMonster } from 'apps/game-service/src/game/player/player.interfaces';

// Le catalogue des 6 équipes du Bot
export const PREDEFINED_BOT_TEAMS: CurrentMonster[][] = [
  // Équipe 1 : Spéciale EAU / Vitesse (sharky, fishet, burpy)
  [
    {
      name: 'sharky',
      slot: 0,
      type: 'water',
      life: { current: 150, max: 150 },
      status: [],
      skill: [
        { name: 'Hydrocanon', current: 5, max: 5, type: 'water' },
        { name: 'Charge', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'fishet',
      slot: 1,
      type: 'water',
      life: { current: 120, max: 120 },
      status: [],
      skill: [
        { name: 'Pistolet Eau', current: 10, max: 10, type: 'water' },
        { name: 'Grompfe', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'burpy',
      slot: 2,
      type: 'water',
      life: { current: 100, max: 100 },
      status: [],
      skill: [
        { name: 'Bulle', current: 15, max: 15, type: 'water' },
        { name: 'Tackle', current: 20, max: 20, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
  ],

  // Équipe 2 : Tank / TERRE & PLANTE (gigantomakia, papate, leaves)
  [
    {
      name: 'gigantomakia',
      slot: 0,
      type: 'earth',
      life: { current: 200, max: 200 },
      status: [],
      skill: [
        { name: 'Séisme', current: 5, max: 5, type: 'earth' },
        { name: 'Plaquage', current: 10, max: 10, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'papate',
      slot: 1,
      type: 'earth',
      life: { current: 180, max: 180 },
      status: [],
      skill: [
        { name: 'Jet de Pierres', current: 10, max: 10, type: 'earth' },
        { name: 'Charge', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'leaves',
      slot: 2,
      type: 'plant',
      life: { current: 80, max: 80 },
      status: [],
      skill: [
        { name: 'Tranch\'Herbe', current: 10, max: 10, type: 'plant' },
        { name: 'Vampigraine', current: 10, max: 10, type: 'plant' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
  ],

  // Équipe 3 : Ultra Rapide / VOL & NEUTRE (pigeonne, squirrel, monkel)
  [
    {
      name: 'pigeonne',
      slot: 0,
      type: 'fly',
      life: { current: 120, max: 120 },
      status: [],
      skill: [
        { name: 'Tornade', current: 10, max: 10, type: 'fly' },
        { name: 'Cru-Aile', current: 15, max: 15, type: 'fly' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'squirrel',
      slot: 1,
      type: 'neutral',
      life: { current: 100, max: 100 },
      status: [],
      skill: [
        { name: 'Morsure', current: 15, max: 15, type: 'neutral' },
        { name: 'Vitesse Extrême', current: 5, max: 5, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'monkel',
      slot: 2,
      type: 'neutral',
      life: { current: 130, max: 130 },
      status: [],
      skill: [
        { name: 'Coup de Poing', current: 15, max: 15, type: 'neutral' },
        { name: 'Grimace', current: 20, max: 20, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
  ],

  // Équipe 4 : Équilibrée (sharky, gigantomakia, leaves)
  [
    {
      name: 'sharky',
      slot: 0,
      type: 'water',
      life: { current: 150, max: 150 },
      status: [],
      skill: [
        { name: 'Hydrocanon', current: 5, max: 5, type: 'water' },
        { name: 'Charge', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'gigantomakia',
      slot: 1,
      type: 'earth',
      life: { current: 200, max: 200 },
      status: [],
      skill: [
        { name: 'Séisme', current: 5, max: 5, type: 'earth' },
        { name: 'Plaquage', current: 10, max: 10, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'leaves',
      slot: 2,
      type: 'plant',
      life: { current: 80, max: 80 },
      status: [],
      skill: [
        { name: 'Fouet Liiane', current: 15, max: 15, type: 'plant' },
        { name: 'Charge', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
  ],

  // Équipe 5 : Starter / Débutant (pisciner, squirrel, papate)
  [
    {
      name: 'pisciner',
      slot: 0,
      type: 'neutral',
      life: { current: 50, max: 50 },
      status: [],
      skill: [
        { name: 'Charge', current: 15, max: 15, type: 'neutral' },
        { name: 'Pistolet Eau', current: 10, max: 10, type: 'water' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'squirrel',
      slot: 1,
      type: 'neutral',
      life: { current: 100, max: 100 },
      status: [],
      skill: [
        { name: 'Morsure', current: 15, max: 15, type: 'neutral' },
        { name: 'Mimi-Queue', current: 20, max: 20, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'papate',
      slot: 2,
      type: 'earth',
      life: { current: 180, max: 180 },
      status: [],
      skill: [
        { name: 'Jet de Pierres', current: 10, max: 10, type: 'earth' },
        { name: 'Charge', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
  ],

  // Équipe 6 : Aérienne & Aquatique (pigeonne, burpy, fishet)
  [
    {
      name: 'pigeonne',
      slot: 0,
      type: 'fly',
      life: { current: 120, max: 120 },
      status: [],
      skill: [
        { name: 'Tornade', current: 10, max: 10, type: 'fly' },
        { name: 'Cru-Aile', current: 15, max: 15, type: 'fly' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'burpy',
      slot: 1,
      type: 'water',
      life: { current: 100, max: 100 },
      status: [],
      skill: [
        { name: 'Bulle', current: 15, max: 15, type: 'water' },
        { name: 'Tackle', current: 20, max: 20, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
    {
      name: 'fishet',
      slot: 2,
      type: 'water',
      life: { current: 120, max: 120 },
      status: [],
      skill: [
        { name: 'Pistolet Eau', current: 10, max: 10, type: 'water' },
        { name: 'Grompfe', current: 15, max: 15, type: 'neutral' },
        { name: '', current: 0, max: 0, type: '' },
        { name: '', current: 0, max: 0, type: '' },
      ],
    },
  ],
];

/**
 * Tire au sort l'une des 6 équipes prédéfinies
 */
export function getRandomBotTeam(): CurrentMonster[] {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_BOT_TEAMS.length);
  // Utilisation de structuredClone / JSON parse pour copier proprement les objets
  return JSON.parse(JSON.stringify(PREDEFINED_BOT_TEAMS[randomIndex]));
}