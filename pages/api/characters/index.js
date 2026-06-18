import prisma from "../../../lib/prisma";
import { getCurrentUser } from "../../../lib/auth/currentUser";
import { createActivityLog } from "../../../lib/game/activityLog";
import { isValidClass, isValidRace } from "../../../lib/game/characterOptions";
import { STARTING_LOCATION_KEY } from "../../../lib/game/worldLocations";

function toSafeCharacter(character) {
  return {
    id: character.id,
    name: character.name,
    race: character.race,
    characterClass: character.characterClass,
    level: character.level,
    experience: character.experience,
    gold: character.gold,
    stamina: character.stamina,
    maxStamina: character.maxStamina,
    stress: character.stress,
    renown: character.renown,
    currentLocation: character.currentLocation,
    createdAt: character.createdAt,
    updatedAt: character.updatedAt,
  };
}

function getCharacterInput(body) {
  return {
    name: typeof body?.name === "string" ? body.name.trim() : "",
    race: typeof body?.race === "string" ? body.race.trim() : "",
    characterClass:
      typeof body?.characterClass === "string" ? body.characterClass.trim() : "",
  };
}

function validateCharacterInput({ name, race, characterClass }) {
  if (!name) {
    return "Name is required.";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters long.";
  }

  if (name.length > 40) {
    return "Name must be 40 characters or fewer.";
  }

  if (!race) {
    return "Race is required.";
  }

  if (!isValidRace(race)) {
    return "Race is not allowed.";
  }

  if (!characterClass) {
    return "Character class is required.";
  }

  if (!isValidClass(characterClass)) {
    return "Character class is not allowed.";
  }

  return null;
}

async function handleGet(res, user) {
  const characters = await prisma.character.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return res.status(200).json({
    characters: characters.map(toSafeCharacter),
  });
}

async function handlePost(req, res, user) {
  const input = getCharacterInput(req.body);
  const validationError = validateCharacterInput(input);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const character = await prisma.$transaction(async (tx) => {
    const createdCharacter = await tx.character.create({
      data: {
        userId: user.id,
        name: input.name,
        race: input.race,
        characterClass: input.characterClass,
        currentLocation: STARTING_LOCATION_KEY,
      },
    });

    await createActivityLog(
      {
        characterId: createdCharacter.id,
        type: "character_created",
        title: "Character Created",
        description: "The road remembers the first step.",
        details: {
          characterName: createdCharacter.name,
          race: createdCharacter.race,
          characterClass: createdCharacter.characterClass,
          currentLocation: createdCharacter.currentLocation,
        },
      },
      tx,
    );

    return createdCharacter;
  });

  return res.status(201).json({
    character: toSafeCharacter(character),
  });
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    if (req.method === "GET") {
      return handleGet(res, user);
    }

    return handlePost(req, res, user);
  } catch (error) {
    console.error("Character API failed:", error);
    return res.status(500).json({ error: "Character request failed." });
  }
}
