export const STARTING_LOCATION_KEY = "kingstone";

export const REALMS = [
  {
    key: "heartlands",
    name: "Heartlands",
    primaryPeople: "Humans",
    capitalLocationKey: "kingstone",
    shortDescription:
      "The political and symbolic center of mortal rule, tied to the Empty Throne and the Ever-King prophecy.",
  },
  {
    key: "mirkvale",
    name: "Mirkvale",
    primaryPeople: "Elves and Aasimar",
    capitalLocationKey: "elarion",
    shortDescription:
      "A realm of old forests, silver waters, sacred groves, and ancient elven memory.",
  },
  {
    key: "western-coast",
    name: "Western Coast",
    primaryPeople: "Half-Elves",
    capitalLocationKey: "bayside",
    shortDescription:
      "A coastal realm of trade, sea-roads, mixed bloodlines, and storm-battered settlements.",
  },
  {
    key: "skypeaks",
    name: "Skypeaks",
    primaryPeople: "Goliaths",
    capitalLocationKey: "skyreach",
    shortDescription:
      "A harsh mountain realm of trials, storm peaks, ancestral endurance, and highland strength.",
  },
  {
    key: "ironspine",
    name: "Ironspine",
    primaryPeople: "Dwarves and Gnomes",
    capitalLocationKey: "khazad-krag",
    shortDescription:
      "A great mountain-hold realm of forgecraft, tunnels, machinery, and old stone authority.",
  },
  {
    key: "green-hollows",
    name: "Green Hollows",
    primaryPeople: "Halflings",
    capitalLocationKey: "hearthollow",
    shortDescription:
      "A softer realm of fields, burrows, orchards, hidden roads, and quiet courage.",
  },
  {
    key: "nameless-peaks",
    name: "Nameless Peaks",
    primaryPower: "The Everlasting Conclave",
    capitalLocationKey: "the-eternal-arcanum",
    shortDescription:
      "The sacred high realm of prophecy, celestial craft, judgment, archives, and hidden will.",
  },
  {
    key: "frostfjords",
    name: "Frostfjords",
    primaryPeople: "Sea-Kings",
    capitalLocationKey: "skallheim",
    shortDescription:
      "A northern realm of cold seas, longships, raven banners, frozen halls, and ocean-born kings.",
  },
  {
    key: "shrouded-isles",
    name: "Shrouded Isles",
    primaryPeople: "Islanders and Corsairs",
    capitalLocationKey: "mistport",
    shortDescription:
      "A realm of fog, salt, smugglers, pirates, drowned shrines, and ghost-lit waters.",
  },
  {
    key: "sunscar-expanse",
    name: "Sunscar Expanse",
    primaryPeople: "Trade Realms and Desert Powers",
    capitalLocationKey: "azharad",
    shortDescription:
      "A desert trade realm of caravans, sunburnt roads, shadow markets, and dangerous wealth.",
  },
  {
    key: "hollow-wilds",
    name: "Hollow Wilds",
    primaryPeople: "Beast-Clans",
    capitalLocationKey: "greythorne",
    shortDescription:
      "A primal woodland realm of old ways, moon rites, beast clans, root graves, and deep forest law.",
  },
  {
    key: "broken-deeps",
    name: "Broken Deeps",
    primaryPeople: "Outcast Dwarves",
    capitalLocationKey: "grudgeborn",
    shortDescription:
      "A seceded dwarven realm of oathbreakers and those who chose the dark below.",
  },
  {
    key: "ash-lands",
    name: "Ash Lands",
    primaryPeople: "Dragonborn",
    capitalLocationKey: "drakonfyr",
    shortDescription:
      "A volcanic realm of ash, dragon memory, black mountains, and ancient draconic shrines.",
  },
  {
    key: "black-marches",
    name: "Black Marches",
    primaryPeople: "Greenskins",
    capitalLocationKey: "gorefang",
    shortDescription:
      "A brutal realm of warbands, iron camps, bone trophies, and greenskin hierarchy.",
  },
  {
    key: "sable-dominion",
    name: "Sable Dominion",
    primaryPeople: "Tieflings",
    capitalLocationKey: "vael-theris",
    shortDescription:
      "A dark, elegant, infernal-leaning realm of courts, bargains, markets, and guarded gates.",
  },
  {
    key: "realm-of-rebirth",
    name: "Realm of Rebirth",
    primaryPower: "The Lord of Crystals",
    capitalLocationKey: "realm-of-rebirth",
    shortDescription:
      "A place of false renewal, crystal corruption, and life remade under domination.",
  },
  {
    key: "realm-of-death",
    name: "Realm of Death",
    primaryPower: "Death, Undeath, and Old Silence",
    capitalLocationKey: "realm-of-death",
    shortDescription:
      "A dark realm of endings, graves, lost souls, and powers outside the living world.",
  },
  {
    key: "realm-of-shadows",
    name: "Realm of Shadows",
    primaryPower: "Shadow, Secrets, and Hidden Paths",
    capitalLocationKey: "realm-of-shadows",
    shortDescription:
      "A realm of veils, hidden truths, deception, shadow roads, and things unseen.",
  },
];

function location(key, name, realmKey, type, shortDescription) {
  return {
    key,
    name,
    realmKey,
    type,
    shortDescription,
  };
}

export const LOCATIONS = [
  location(
    "kingstone",
    "Kingstone",
    "heartlands",
    "capital",
    "The heart of mortal rule and the default starting point for new characters.",
  ),
  location(
    "golden-citadel",
    "Golden Citadel",
    "heartlands",
    "stronghold",
    "A seat of old authority bound to the prophecy of the Empty Throne.",
  ),
  location(
    "empty-throne",
    "Empty Throne",
    "heartlands",
    "landmark",
    "The vacant symbol at the center of the Ever-King prophecy.",
  ),
  location("goldmere", "Goldmere", "heartlands", "settlement", "A Heartlands settlement marked by old wealth and memory."),
  location("blackthorn-hold", "Blackthorn Hold", "heartlands", "stronghold", "A hard border hold with a name fit for bad roads."),
  location("northwatch", "Northwatch", "heartlands", "stronghold", "A northern watch point guarding troubled approaches."),
  location("barrowfield", "Barrowfield", "heartlands", "wilderness", "A field of old graves and older unease."),
  location("saints-hollow", "Saint's Hollow", "heartlands", "shrine", "A hollow place of faith, memory, and quiet danger."),
  location("mournstead", "Mournstead", "heartlands", "settlement", "A sorrow-marked settlement on the Heartlands road."),

  location("elarion", "Elarion", "mirkvale", "capital", "The elven heart of Mirkvale and its old forest memory."),
  location("silvergrove", "Silvergrove", "mirkvale", "wilderness", "A silver-lit grove where beauty and danger share roots."),
  location("silver-lake", "Silver Lake", "mirkvale", "landmark", "A cold, bright water tied to Mirkvale's old stillness."),
  location("thornveil", "Thornveil", "mirkvale", "wilderness", "A veiled thornwood where the path does not stay kind."),
  location("ithariels-grove", "Ithariel's Grove", "mirkvale", "shrine", "A sacred grove carrying ancient elven memory."),
  location("whispering-forest", "Whispering Forest", "mirkvale", "wilderness", "A forest of voices, warnings, and things half-heard."),
  location("dawnsanctum", "Dawnsanctum", "mirkvale", "shrine", "A sanctum of silver dawn and guarded rites."),

  location("bayside", "Bayside", "western-coast", "capital", "The coastal heart of trade and mixed bloodlines."),
  location("moonharbor", "Moonharbor", "western-coast", "settlement", "A moonlit harbor for sea-roads and wary bargains."),
  location("seaglass-cove", "Seaglass Cove", "western-coast", "landmark", "A broken-bright cove shaped by storm and tide."),
  location("stormrest", "Stormrest", "western-coast", "settlement", "A battered place where the weather is never fully past."),
  location("windward-beacon", "Windward Beacon", "western-coast", "landmark", "A sea-facing beacon for ships and warnings."),
  location("blacktide", "Blacktide", "western-coast", "wilderness", "A dangerous stretch of dark water and coastal fear."),
  location("shattered-wharf", "Shattered Wharf", "western-coast", "market", "A broken trade edge where cargo and trouble land."),

  location("skyreach", "Skyreach", "skypeaks", "capital", "The high mountain heart of goliath endurance."),
  location("thunderhallow", "Thunderhallow", "skypeaks", "landmark", "A storm-marked hollow among the high peaks."),
  location("frostvein", "Frostvein", "skypeaks", "wilderness", "A cold mountain route cut through ice and stone."),
  location("cloudbreaker", "Cloudbreaker", "skypeaks", "landmark", "A peak that stands above cloud and comfort."),
  location("trial-steps", "Trial Steps", "skypeaks", "landmark", "A harsh path of endurance and ancestral proof."),
  location("titans-rest", "Titan's Rest", "skypeaks", "landmark", "A giant-haunted place of stone memory."),
  location("stoneheart", "Stoneheart", "skypeaks", "stronghold", "A hard mountain refuge with little room for weakness."),

  location("khazad-krag", "Khazad-Krag", "ironspine", "capital", "The great hold at the heart of Ironspine."),
  location("glimmerdeep", "Glimmerdeep", "ironspine", "dungeon", "A deep place of buried light and old tunnels."),
  location("carmine-bank", "Carmine-Bank", "ironspine", "settlement", "A stone settlement named in the color of debt and ore."),
  location("emberfall-forge", "Emberfall Forge", "ironspine", "landmark", "A forge of heat, craft, and old mountain labor."),
  location("threshold-of-kin", "Threshold of Kin", "ironspine", "landmark", "A place of kinship, passage, and dwarven law."),
  location("stonewake", "Stonewake", "ironspine", "settlement", "A mountain settlement where old stone keeps watch."),
  location("underhold", "Underhold", "ironspine", "stronghold", "A lower hold of tunnels, machinery, and guarded doors."),

  location("hearthollow", "Hearthollow", "green-hollows", "capital", "The warm heart of halfling fields and burrows."),
  location("appleburrow", "Appleburrow", "green-hollows", "settlement", "A burrow settlement of orchards and hidden courage."),
  location("honeyhill", "Honeyhill", "green-hollows", "settlement", "A soft hill settlement with quiet defenses."),
  location("mossbrook", "Mossbrook", "green-hollows", "settlement", "A brookside place of moss, roots, and small roads."),
  location("old-warren", "Old Warren", "green-hollows", "dungeon", "An old burrow network with deeper secrets."),
  location("wicker-hollow", "Wicker Hollow", "green-hollows", "settlement", "A hollow settlement of woven craft and hidden paths."),
  location("bramblefoot", "Bramblefoot", "green-hollows", "wilderness", "A brambled path where small folk learned caution."),

  location("the-eternal-arcanum", "The Eternal Arcanum", "nameless-peaks", "capital", "The high seat of the Everlasting Conclave."),
  location("the-hall-of-prophecies", "The Hall of Prophecies", "nameless-peaks", "landmark", "A hall of guarded futures and dangerous judgment."),
  location("the-heavenly-forge", "The Heavenly Forge", "nameless-peaks", "landmark", "A celestial forge bound to sacred craft."),
  location("the-high-grounds", "The High Grounds", "nameless-peaks", "wilderness", "A rarefied height where the world feels judged."),
  location("the-celestial-steps", "The Celestial Steps", "nameless-peaks", "landmark", "A sacred ascent into Conclave mystery."),
  location("the-veiled-archives", "The Veiled Archives", "nameless-peaks", "landmark", "Hidden archives of prophecy, memory, and guarded truth."),
  location("crownward-spires", "Crownward Spires", "nameless-peaks", "stronghold", "High spires facing crown, prophecy, and old duty."),

  location("skallheim", "Skallheim", "frostfjords", "capital", "The cold hall heart of sea-kings and raven banners."),
  location("whalebone", "Whalebone", "frostfjords", "settlement", "A northern settlement shaped by sea, bone, and winter."),
  location("stormwake", "Stormwake", "frostfjords", "settlement", "A settlement that survives in the wake of hard storms."),
  location("ravenrock", "Ravenrock", "frostfjords", "stronghold", "A black northern rock watched by raven banners."),
  location("hall-of-sails", "Hall of Sails", "frostfjords", "landmark", "A hall of ships, claims, and ocean-born rule."),
  location("frostmere", "Frostmere", "frostfjords", "wilderness", "A cold water and ice-lashed stretch of the north."),
  location("worldbreaker-strand", "Worldbreaker Strand", "frostfjords", "landmark", "A brutal strand where sea and stone seem to break the world."),

  location("mistport", "Mistport", "shrouded-isles", "capital", "The fog-bound port at the heart of the Shrouded Isles."),
  location("blackwater-key", "Blackwater Key", "shrouded-isles", "settlement", "An island key of dark water and wary sailors."),
  location("gloam-reefs", "Gloam Reefs", "shrouded-isles", "wilderness", "Treacherous reefs under ghostly half-light."),
  location("wraithmoor", "Wraithmoor", "shrouded-isles", "wilderness", "A haunted moor where the dead feel close."),
  location("salt-chapel", "Salt Chapel", "shrouded-isles", "shrine", "A salt-stained chapel beside drowned prayers."),
  location("crows-lantern", "Crow's Lantern", "shrouded-isles", "landmark", "A grim lantern for smugglers, sailors, and warnings."),
  location("drowned-market", "Drowned Market", "shrouded-isles", "market", "A waterlogged market of contraband and old bargains."),

  location("azharad", "Azharad", "sunscar-expanse", "capital", "The desert trade heart of the Sunscar Expanse."),
  location("amber-road", "Amber Road", "sunscar-expanse", "landmark", "A caravan road of heat, dust, and profit."),
  location("dunefall", "Dunefall", "sunscar-expanse", "settlement", "A settlement pressed between dune and danger."),
  location("shadow-bazaar", "Shadow Bazaar", "sunscar-expanse", "market", "A market of shade, secrets, and risky coin."),
  location("sunspire", "Sunspire", "sunscar-expanse", "landmark", "A bright spire standing over hard desert roads."),
  location("red-caravanserai", "Red Caravanserai", "sunscar-expanse", "market", "A caravanserai of red dust, trade, and guarded sleep."),
  location("gilded-vaults", "Gilded Vaults", "sunscar-expanse", "dungeon", "Vaults of dangerous wealth and locked memory."),

  location("greythorne", "Greythorne", "hollow-wilds", "capital", "The primal heart of beast-clan woodland law."),
  location("the-old-ways", "The Old Ways", "hollow-wilds", "landmark", "Ancient woodland paths governed by root and rite."),
  location("moonfang", "Moonfang", "hollow-wilds", "wilderness", "A moon-haunted wild place of tooth and oath."),
  location("elder-circle", "Elder Circle", "hollow-wilds", "shrine", "A ritual circle for old forest judgment."),
  location("briarwatch", "Briarwatch", "hollow-wilds", "stronghold", "A thorn-guarded watch in deep woodland."),
  location("weeping-grove", "Weeping Grove", "hollow-wilds", "wilderness", "A grove of sorrowing trees and old warnings."),
  location("rootgrave", "Rootgrave", "hollow-wilds", "dungeon", "A root-choked grave place where the forest remembers."),

  location("grudgeborn", "Grudgeborn", "broken-deeps", "capital", "The bitter heart of the outcast dwarven deeps."),
  location("blackrift", "Blackrift", "broken-deeps", "dungeon", "A dark split in the deep stone."),
  location("shattered-anvil", "Shattered Anvil", "broken-deeps", "landmark", "A broken symbol of craft, oath, and ruin."),
  location("oathbreak-vault", "Oathbreak Vault", "broken-deeps", "dungeon", "A vault of broken vows and hidden cost."),
  location("cinderdelve", "Cinderdelve", "broken-deeps", "dungeon", "A burned delving of ash, tools, and old anger."),
  location("hollow-crown", "Hollow Crown", "broken-deeps", "landmark", "A crown-shaped wound in the politics of the deep."),
  location("deepscar", "Deepscar", "broken-deeps", "wilderness", "A scar through the underworld of the Broken Deeps."),

  location("drakonfyr", "Drakonfyr", "ash-lands", "capital", "The volcanic heart of dragonborn memory."),
  location("mount-blackscale", "Mount Blackscale", "ash-lands", "landmark", "A black mountain of ash, heat, and draconic shadow."),
  location("ember-wastes", "Ember Wastes", "ash-lands", "wilderness", "A burned expanse of ember and hard survival."),
  location("ashen-crowns", "Ashen Crowns", "ash-lands", "landmark", "Crowned ash formations tied to old draconic stories."),
  location("dragons-landing", "Dragon's Landing", "ash-lands", "landmark", "A landing place marked by dragon memory."),
  location("smoking-step", "Smoking Step", "ash-lands", "wilderness", "A smoking volcanic route through the Ash Lands."),
  location("vermithrax-shrine", "Vermithrax Shrine", "ash-lands", "shrine", "An ancient shrine of draconic reverence."),

  location("gorefang", "Gorefang", "black-marches", "capital", "The brutal seat of greenskin warband power."),
  location("grimhook", "Grimhook", "black-marches", "settlement", "A harsh camp settlement of hooks, threats, and survival."),
  location("skullforge", "Skullforge", "black-marches", "stronghold", "A forge stronghold of bone trophies and iron noise."),
  location("ironhowl", "Ironhowl", "black-marches", "stronghold", "A war-camp stronghold where iron answers with teeth."),
  location("blacktooth-ridge", "Blacktooth Ridge", "black-marches", "wilderness", "A jagged ridge under hard greenskin rule."),
  location("warpit", "Warpit", "black-marches", "dungeon", "A pit of violence, hierarchy, and brutal trials."),
  location("skullriver-crossing", "Skullriver Crossing", "black-marches", "landmark", "A crossing marked by trophies and blood memory."),

  location("vael-theris", "Vael'Theris", "sable-dominion", "capital", "The dark court heart of the Sable Dominion."),
  location("crimson-court", "Crimson Court", "sable-dominion", "stronghold", "A court of bargains, blood-colored halls, and careful words."),
  location("ashveil-bazaar", "Ashveil Bazaar", "sable-dominion", "market", "A red-lit market of guarded deals and infernal taste."),
  location("hollowspire", "Hollowspire", "sable-dominion", "landmark", "A black tower of echo, bargain, and watchfulness."),
  location("nine-gates", "Nine Gates", "sable-dominion", "landmark", "Guarded gates into darker order and older bargains."),

  location("realm-of-rebirth", "Realm of Rebirth", "realm-of-rebirth", "realm", "The crystal-tied realm of false renewal and domination."),
  location("realm-of-death", "Realm of Death", "realm-of-death", "realm", "The realm of endings, graves, lost souls, and old silence."),
  location("realm-of-shadows", "Realm of Shadows", "realm-of-shadows", "realm", "The realm of veils, hidden paths, secrets, and moving shadows."),
];

export function getRealmByKey(realmKey) {
  return REALMS.find((realm) => realm.key === realmKey) || null;
}

export function getLocationByKey(locationKey) {
  return LOCATIONS.find((locationEntry) => locationEntry.key === locationKey) || null;
}

export function getLocationsByRealm(realmKey) {
  return LOCATIONS.filter((locationEntry) => locationEntry.realmKey === realmKey);
}

export function isValidLocationKey(locationKey) {
  return Boolean(getLocationByKey(locationKey));
}
