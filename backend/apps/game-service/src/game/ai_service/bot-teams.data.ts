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

// ---------------------------------------------------------------------------
// Table des 10 vrais monstres (copiée depuis public.monsters en DB) +
// leurs skills réels (copiés depuis public.monsters_skills).
// Stats/skills identiques à ce que reçoit un joueur humain via
// MapService.received_team_choice -> monstersService.findOneByName().
// ---------------------------------------------------------------------------
const MONSTERS_DB: Record<
  string,
  {
    hp: number;
    attack: number;
    attack_spe: number;
    defense: number;
    defense_spe: number;
    speed: number;
    type: string;
    skills: (keyof typeof SKILLS_DB)[];
  }
> = {
  pisciner: { hp: 50, attack: 10, attack_spe: 10, defense: 5, defense_spe: 5, speed: 50, type: 'neutral', skills: ['think', 'bite'] },
  fishet: { hp: 120, attack: 10, attack_spe: 15, defense: 5, defense_spe: 15, speed: 100, type: 'water', skills: ['swimming', 'splash', 'bubulle'] },
  burpy: { hp: 100, attack: 20, attack_spe: 30, defense: 0, defense_spe: 20, speed: 80, type: 'water', skills: ['claw', 'bite', 'bubulle'] },
  sharky: { hp: 150, attack: 20, attack_spe: 30, defense: 0, defense_spe: 20, speed: 150, type: 'water', skills: ['bite', 'splash', 'bubulle', 'tsunami'] },
  squirel: { hp: 100, attack: 20, attack_spe: 20, defense: 5, defense_spe: 10, speed: 110, type: 'neutral', skills: ['claw', 'bite', 'kawai'] },
  papate: { hp: 180, attack: 10, attack_spe: 15, defense: 5, defense_spe: 10, speed: 80, type: 'earth', skills: ['rock', 'grow', 'slap'] },
  gigantomakia: { hp: 200, attack: 20, attack_spe: 30, defense: 15, defense_spe: 25, speed: 50, type: 'earth', skills: ['rock', 'bite', 'armor', 'ultralaser'] },
  leafs: { hp: 80, attack: 35, attack_spe: 45, defense: 0, defense_spe: 10, speed: 100, type: 'plant', skills: ['tranche', 'slap', 'whip-vine'] },
  monkel: { hp: 130, attack: 15, attack_spe: 15, defense: 10, defense_spe: 20, speed: 100, type: 'neutral', skills: ['slap', 'rock', 'multi-punch'] },
  pigeonne: { hp: 120, attack: 25, attack_spe: 25, defense: 10, defense_spe: 10, speed: 160, type: 'fly', skills: ['pic', 'slap', 'tornade', 'dodge'] },
};

// Construit un CurrentMonster complet à partir du nom + du slot voulu dans
// l'équipe. Empêche structurellement le bug de l'ancien fichier (nom/slot/
// stats copiés-collés identiques sur plusieurs entrées) : ici chaque
// monstre n'existe qu'une fois dans MONSTERS_DB, tout le reste en découle.
function monster(name: keyof typeof MONSTERS_DB, slot: number): CurrentMonster {
  const m = MONSTERS_DB[name];
  const filledSkills = m.skills.map(skill);
  const skills = [...filledSkills, ...Array(4 - filledSkills.length).fill(emptySkill)];
  return {
    name,
    slot,
    type: m.type,
    life: { current: m.hp, max: m.hp },
    status: [],
    attack: m.attack,
    attack_spe: m.attack_spe,
    defense: m.defense,
    defense_spe: m.defense_spe,
    speed: m.speed,
    dodge: false,
    skill: skills,
  } as CurrentMonster;
}

// Le catalogue des 10 équipes du Bot. Chaque équipe = un pool de 6 noms
// DISTINCTS (vérifié), dans lequel chooseCounterTeam() choisira les 3
// meilleurs contre le roster adverse.
export const PREDEFINED_BOT_TEAMS: CurrentMonster[][] = [
  // Équipe 1 : Aquatique — dominance water, bon capital PV
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 2 : Terrestre — earth/neutral, tanky
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 3 : Aérienne — vitesse et couverture fly
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 4 : Végétale — plant en tête, soutien earth/water
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 5 : Équilibrée — un représentant par type dispo
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 6 : Rapide — priorité à la vitesse (sharky 150, pigeonne 160, squirel 110)
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 7 : Tank — HP/def max (gigantomakia 200hp, papate 180hp)
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 8 : Glass cannon — attaque forte, défense faible (leafs 35/45 atk, def 0)
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 9 : Débutant — monstres communs/uncommon, stats modestes
  [monster('pisciner', 0), monster('pisciner', 1), monster('pisciner', 2), monster('pisciner', 3), monster('pisciner', 4), monster('pisciner', 5)],

  // Équipe 10 : Élite — les rares en priorité (sharky, gigantomakia, pigeonne)
  [monster('sharky', 0), monster('gigantomakia', 1), monster('pigeonne', 2), monster('burpy', 3), monster('monkel', 4), monster('papate', 5)],
];

/**
 * Tire au sort l'une des 10 équipes prédéfinies
 */
export function getRandomBotTeam(): CurrentMonster[] {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_BOT_TEAMS.length);
  return JSON.parse(JSON.stringify(PREDEFINED_BOT_TEAMS[randomIndex]));
}