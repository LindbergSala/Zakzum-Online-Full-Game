export const RACES = [
  "Human",
  "Elf",
  "Aasimar",
  "Half-Elf",
  "Goliath",
  "Dwarf",
  "Gnome",
  "Halfling",
  "Sea-King",
  "Islander",
  "Corsair",
  "Beast-Clan",
  "Outcast Dwarf",
  "Dragonborn",
  "Orc",
  "Troll",
  "Half-Orc",
  "Goblin",
  "Tiefling",
];

export const CLASSES = [
  "Warrior",
  "Ranger",
  "Rogue",
  "Cleric",
  "Mage",
  "Paladin",
  "Bard",
  "Druid",
];

export function isValidRace(race) {
  return RACES.includes(race);
}

export function isValidClass(characterClass) {
  return CLASSES.includes(characterClass);
}
