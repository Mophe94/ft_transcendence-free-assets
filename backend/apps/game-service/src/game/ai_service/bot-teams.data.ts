import { CurrentMonster, Skill } from 'apps/game-service/src/game/player/player.interfaces';

// Table des 19 vraies attaques (copiée depuis public.skills en DB).
// current/max = power_point de la DB. Aucune valeur inventée ici.
const SKILLS_DB: Record<
  string,
  { power_point: number; effect: string; type: string; value: number; repetition: number; precision: number; data: string }
> = {
  think: { power_point: 100, effect: 'damage', type: 'neutral', value: 0, repetition: 1, precision: 100, data: '' },
  claw: { power_point: 10, effect: 'damage', type: 'neutral', value: 1.2, repetition: 1, precision: 100, data: '' },
  slap: { power_point: 10, effect: 'damage', type: 'neutral', value: 1.5, repetition: 1, precision: 100, data: '' },
  bite: { power_point: 10, effect: 'damage', type: 'neutral', value: 2, repetition: 1, precision: 90, data: '' },
  'multi-punch': { power_point: 5, effect: 'damage', type: 'neutral', value: 1, repetition: 4, precision: 75, data: '' },
  ultralaser: { power_point: 1, effect: 'damage', type: 'neutral', value: 4, repetition: 1, precision: 75, data: '' },
  splash: { power_point: 15, effect: 'damage', type: 'water', value: 1, repetition: 1, precision: 100, data: '' },
  bubulle: { power_point: 5, effect: 'damage', type: 'water', value: 1.5, repetition: 3, precision: 75, data: '' },
  tsunami: { power_point: 1, effect: 'damage', type: 'water', value: 4, repetition: 1, precision: 75, data: '' },
  tranche: { power_point: 10, effect: 'damage', type: 'plant', value: 1.5, repetition: 1, precision: 100, data: '' },
  'whip-vine': { power_point: 5, effect: 'damage', type: 'plant', value: 2.5, repetition: 1, precision: 100, data: '' },
  rock: { power_point: 5, effect: 'damage', type: 'earth', value: 1.5, repetition: 1, precision: 100, data: '' },
  pic: { power_point: 10, effect: 'damage', type: 'fly', value: 1.5, repetition: 1, precision: 100, data: '' },
  tornade: { power_point: 3, effect: 'damage', type: 'fly', value: 2.5, repetition: 4, precision: 70, data: '' },
  dodge: { power_point: 3, effect: 'dodge', type: 'none', value: 0, repetition: 1, precision: 100, data: '' },
  armor: { power_point: 3, effect: 'up_stat', type: 'none', value: 5, repetition: 1, precision: 100, data: '' },
  swimming: { power_point: 3, effect: 'up_stat', type: 'none', value: 10, repetition: 1, precision: 100, data: 'speed' },
  grow: { power_point: 3, effect: 'up_stat', type: 'none', value: 5, repetition: 1, precision: 100, data: 'attack' },
  kawai: { power_point: 3, effect: 'down_stat', type: 'none', value: 5, repetition: 1, precision: 100, data: 'attack_spe' },
};

function skill(name: keyof typeof SKILLS_DB): Skill {
  const s = SKILLS_DB[name];
  return { name, current: s.power_point, max: s.power_point, type: s.type, effect: s.effect, repetition: s.repetition, precision: s.precision, data: s.data, value: s.value };
}
const emptySkill: Skill = { name: '', current: 0, max: 0, type: '', effect: '', repetition: 1, precision: 100, data: '', value: 0 };

// ⚠️ attack/attack_spe/defense/defense_spe/speed/dodge : toujours des placeholders, pas de table
// "monsters" reçue pour les vérifier. Seules les attaques ci-dessus sont maintenant des vraies données.
const baseStats = { attack: 20, attack_spe: 20, defense: 20, defense_spe: 20, speed: 20, dodge: false };

// Le catalogue des 6 équipes du Bot
export const PREDEFINED_BOT_TEAMS: CurrentMonster[][] = [


  // Équipe 5 : Starter / Débutant (pisciner, squirrel, papate)
  [
    {
      name: 'pisciner', slot: 0, type: 'neutral', life: { current: 50, max: 50 }, status: [], ...baseStats,
      skill: [skill('slap'), skill('splash'), emptySkill, emptySkill],
    },
    {
      name: 'pisciner', slot: 1, type: 'neutral', life: { current: 100, max: 100 }, status: [], ...baseStats,
      skill: [skill('bite'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'pisciner', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'pisciner', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'pisciner', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'pisciner', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
  ],

  // Équipe 6 : Aérienne & Aquatique (pigeonne, burpy, fishet)
  [
    {
      name: 'sharky', slot: 0, type: 'neutral', life: { current: 50, max: 50 }, status: [], ...baseStats,
      skill: [skill('slap'), skill('splash'), emptySkill, emptySkill],
    },
    {
      name: 'sharky', slot: 1, type: 'neutral', life: { current: 100, max: 100 }, status: [], ...baseStats,
      skill: [skill('bite'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'sharky', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'sharky', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'sharky', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
    {
      name: 'sharky', slot: 2, type: 'earth', life: { current: 180, max: 180 }, status: [], ...baseStats,
      skill: [skill('rock'), skill('multi-punch'), emptySkill, emptySkill],
    },
  ],
];

/**
 * Tire au sort l'une des 6 équipes prédéfinies
 */
export function getRandomBotTeam(): CurrentMonster[] {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_BOT_TEAMS.length);
  return JSON.parse(JSON.stringify(PREDEFINED_BOT_TEAMS[randomIndex]));
}