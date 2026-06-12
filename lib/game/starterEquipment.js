import { CLASSES } from "./characterOptions";

const STARTER_KITS = {
  Warrior: [
    {
      key: "warrior-notched-iron-sword",
      name: "Notched Iron Sword",
      type: "weapon",
      slot: "mainHand",
      description: "A plain road blade with old chips along the edge.",
    },
    {
      key: "warrior-round-shield",
      name: "Weathered Round Shield",
      type: "armor",
      slot: "offHand",
      description: "A scarred wooden shield bound with dull iron.",
    },
    {
      key: "warrior-patched-mail",
      name: "Patched Mail Shirt",
      type: "armor",
      slot: "body",
      description: "Heavy enough to trust, worn enough to doubt.",
    },
    {
      key: "warrior-travel-rations",
      name: "Three Days of Hard Rations",
      type: "supply",
      slot: "pack",
      description: "Dry bread, salted roots, and enough grit to keep walking.",
    },
  ],
  Ranger: [
    {
      key: "ranger-hunting-bow",
      name: "Hunting Bow",
      type: "weapon",
      slot: "mainHand",
      description: "A simple bow built for quiet work beyond the road.",
    },
    {
      key: "ranger-skinning-knife",
      name: "Skinning Knife",
      type: "tool",
      slot: "offHand",
      description: "A useful blade for game, rope, and desperate moments.",
    },
    {
      key: "ranger-trail-cloak",
      name: "Mud-Dark Trail Cloak",
      type: "armor",
      slot: "body",
      description: "A cloak stained by rain, smoke, and forest paths.",
    },
    {
      key: "ranger-field-pack",
      name: "Field Pack",
      type: "supply",
      slot: "pack",
      description: "A lean pack with cord, tinder, and wrapped trail food.",
    },
  ],
  Rogue: [
    {
      key: "rogue-short-blade",
      name: "Short Blade",
      type: "weapon",
      slot: "mainHand",
      description: "A close blade with no ornament and many uses.",
    },
    {
      key: "rogue-lock-picks",
      name: "Bent Lock Picks",
      type: "tool",
      slot: "pack",
      description: "A small roll of picks, filed thin and wrapped in cloth.",
    },
    {
      key: "rogue-dark-jerkin",
      name: "Dark Leather Jerkin",
      type: "armor",
      slot: "body",
      description: "Quiet leather patched where old trouble found it.",
    },
    {
      key: "rogue-smoke-pouch",
      name: "Ash Smoke Pouch",
      type: "supply",
      slot: "pack",
      description: "A bitter powder meant to cover a hurried retreat.",
    },
  ],
  Cleric: [
    {
      key: "cleric-iron-mace",
      name: "Iron Mace",
      type: "weapon",
      slot: "mainHand",
      description: "A blunt weapon carried by those who expect no clean road.",
    },
    {
      key: "cleric-worn-prayer-token",
      name: "Worn Prayer Token",
      type: "focus",
      slot: "offHand",
      description: "A handled token rubbed smooth by fear and faith.",
    },
    {
      key: "cleric-padded-vestment",
      name: "Padded Vestment",
      type: "armor",
      slot: "body",
      description: "Plain cloth and padding marked by old candle smoke.",
    },
    {
      key: "cleric-bandage-roll",
      name: "Clean Bandage Roll",
      type: "supply",
      slot: "pack",
      description: "A careful roll of linen saved for the wound that matters.",
    },
  ],
  Mage: [
    {
      key: "mage-ashwood-staff",
      name: "Ashwood Staff",
      type: "weapon",
      slot: "mainHand",
      description: "A walking staff carved with shallow ward marks.",
    },
    {
      key: "mage-cracked-focus-stone",
      name: "Cracked Focus Stone",
      type: "focus",
      slot: "offHand",
      description: "A dull stone that still holds a thread of old power.",
    },
    {
      key: "mage-threadbare-robe",
      name: "Threadbare Robe",
      type: "armor",
      slot: "body",
      description: "A travel robe patched at the cuffs and smelling of smoke.",
    },
    {
      key: "mage-ink-wrapped-notes",
      name: "Ink-Wrapped Notes",
      type: "tool",
      slot: "pack",
      description: "Loose pages of signs, warnings, and half-trusted formulae.",
    },
  ],
  Paladin: [
    {
      key: "paladin-oath-worn-sword",
      name: "Oath-Worn Sword",
      type: "weapon",
      slot: "mainHand",
      description: "A serviceable sword kept sharp for promises not yet broken.",
    },
    {
      key: "paladin-plain-kite-shield",
      name: "Plain Kite Shield",
      type: "armor",
      slot: "offHand",
      description: "A narrow shield with old paint scraped from its face.",
    },
    {
      key: "paladin-road-mail",
      name: "Road Mail",
      type: "armor",
      slot: "body",
      description: "Mail repaired for travel rather than parade.",
    },
    {
      key: "paladin-oath-cord",
      name: "Frayed Oath Cord",
      type: "focus",
      slot: "none",
      description: "A knotted cord kept close when vows grow heavy.",
    },
  ],
  Bard: [
    {
      key: "bard-small-dagger",
      name: "Small Dagger",
      type: "weapon",
      slot: "mainHand",
      description: "A modest blade hidden beside songs and stories.",
    },
    {
      key: "bard-road-lute",
      name: "Road Lute",
      type: "tool",
      slot: "pack",
      description: "A battered instrument that has earned more meals than coins.",
    },
    {
      key: "bard-travel-coat",
      name: "Travel Coat",
      type: "armor",
      slot: "body",
      description: "A patched coat with room for notes, charms, and debts.",
    },
    {
      key: "bard-scrap-songbook",
      name: "Scrap Songbook",
      type: "focus",
      slot: "pack",
      description: "Loose songs about old roads, bad kings, and worse weather.",
    },
  ],
  Druid: [
    {
      key: "druid-crook-staff",
      name: "Crook Staff",
      type: "weapon",
      slot: "mainHand",
      description: "A hooked staff cut from living wood and darkened by rain.",
    },
    {
      key: "druid-bone-charm",
      name: "Bone-and-Root Charm",
      type: "focus",
      slot: "offHand",
      description: "A rough charm tied with root fiber and quiet warnings.",
    },
    {
      key: "druid-hide-wrap",
      name: "Hide Wrap",
      type: "armor",
      slot: "body",
      description: "Layered hide and cloth meant for thorns, cold, and travel.",
    },
    {
      key: "druid-herb-pouch",
      name: "Bitter Herb Pouch",
      type: "supply",
      slot: "pack",
      description: "Dried leaves and roots for pain, fever, and bad nights.",
    },
  ],
};

export const STARTER_EQUIPMENT_BY_CLASS = CLASSES.reduce((equipmentByClass, characterClass) => {
  return {
    ...equipmentByClass,
    [characterClass]: STARTER_KITS[characterClass] || [],
  };
}, {});

export function getStarterEquipmentForClass(characterClass) {
  const equipment = STARTER_EQUIPMENT_BY_CLASS[characterClass] || [];

  return equipment.map((item) => ({ ...item }));
}
