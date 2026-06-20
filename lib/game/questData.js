import { isValidLocationKey } from "./worldLocations.js";

export const QUEST_TYPES = [
  "notice",
  "delivery",
  "investigation",
  "exploration",
  "recovery",
  "defense",
];

export const QUEST_STATUSES = ["available", "accepted", "completed", "failed"];

export const QUESTS = [
  {
    key: "warnings-on-the-old-road",
    title: "Warnings on the Old Road",
    type: "notice",
    startLocationKey: "kingstone",
    shortDescription:
      "Check the weathered warning posts along the first road beyond Kingstone.",
    briefing:
      "Three warning posts have gone unread since the last hard rain. Walk the road, record what remains, and return before dusk.",
    suggestedLevel: 1,
    isStarterQuest: true,
    rewards: {
      gold: 5,
      experience: 10,
      renown: 1,
    },
    objectives: [
      "Read the road notice posted in Kingstone.",
      "Inspect the marked warning posts beyond the city.",
      "Return your findings to Kingstone.",
    ],
  },
  {
    key: "a-sealed-word-from-goldmere",
    title: "A Sealed Word from Goldmere",
    type: "delivery",
    startLocationKey: "goldmere",
    shortDescription:
      "Carry a sealed message from Goldmere before the road turns uncertain.",
    briefing:
      "A local reeve needs a plain message carried under an unbroken seal. The work is simple only if the road stays quiet.",
    suggestedLevel: 1,
    isStarterQuest: true,
    rewards: {
      gold: 8,
      experience: 12,
      renown: 1,
    },
    objectives: [
      "Collect the sealed message in Goldmere.",
      "Keep the seal intact while on the road.",
      "Deliver the message to its named recipient.",
    ],
  },
  {
    key: "marks-among-the-barrows",
    title: "Marks Among the Barrows",
    type: "investigation",
    startLocationKey: "barrowfield",
    shortDescription:
      "Examine fresh marks left among graves that should have remained undisturbed.",
    briefing:
      "Rain exposed tracks between the oldest stones. No one is asking for bravery, only a careful account of where they begin and end.",
    suggestedLevel: 2,
    isStarterQuest: true,
    rewards: {
      gold: 10,
      experience: 15,
      renown: 1,
    },
    objectives: [
      "Survey the disturbed edge of Barrowfield.",
      "Record the direction and shape of the fresh tracks.",
      "Report what you found without disturbing the graves.",
    ],
  },
  {
    key: "the-long-watch-north",
    title: "The Long Watch North",
    type: "defense",
    startLocationKey: "northwatch",
    shortDescription:
      "Walk the outer watch line and account for each warning fire before nightfall.",
    briefing:
      "Two signal fires failed during the last watch. Northwatch needs clear eyes on the approaches, not a hero looking for a fight.",
    suggestedLevel: 2,
    isStarterQuest: false,
    rewards: {
      gold: 12,
      experience: 18,
      renown: 2,
    },
    objectives: [
      "Inspect the outer warning fires at Northwatch.",
      "Note damaged markers or signs of passage.",
      "Return a complete watch report.",
    ],
  },
];

export function getQuestByKey(questKey) {
  return QUESTS.find((quest) => quest.key === questKey) || null;
}

export function getQuestsByLocation(locationKey) {
  if (!isValidLocationKey(locationKey)) {
    return [];
  }

  return QUESTS.filter((quest) => quest.startLocationKey === locationKey);
}

export function getAvailableQuestsForLocation(locationKey) {
  return getQuestsByLocation(locationKey);
}

export function isValidQuestKey(questKey) {
  return Boolean(getQuestByKey(questKey));
}

export function isValidQuestStatus(status) {
  return QUEST_STATUSES.includes(status);
}
