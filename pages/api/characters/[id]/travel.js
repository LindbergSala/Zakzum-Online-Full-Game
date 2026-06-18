import { getCurrentUser } from "../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../lib/game/activityLog";
import {
  getTravelDestinationSummary,
  getTravelValidationError,
} from "../../../../lib/game/travelRules";
import {
  getTravelCost,
  getTravelCostValidationError,
} from "../../../../lib/game/travelCostRules";
import { getLocationByKey } from "../../../../lib/game/worldLocations";
import prisma from "../../../../lib/prisma";

function getCharacterId(req) {
  return Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
}

function getDestinationLocationKey(req) {
  return typeof req.body?.destinationLocationKey === "string"
    ? req.body.destinationLocationKey.trim()
    : "";
}

function getLocationName(locationKey) {
  return getLocationByKey(locationKey)?.name || locationKey;
}

async function getOwnedCharacter(characterId, userId) {
  if (!characterId) {
    return null;
  }

  return prisma.character.findFirst({
    where: {
      id: characterId,
      userId,
    },
    select: {
      id: true,
      name: true,
      currentLocation: true,
      stamina: true,
      maxStamina: true,
      stress: true,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const characterId = getCharacterId(req);
    const destinationLocationKey = getDestinationLocationKey(req);

    if (!destinationLocationKey) {
      return res.status(400).json({ error: "Destination location is required." });
    }

    const character = await getOwnedCharacter(characterId, user.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    const validationError = getTravelValidationError({
      currentLocationKey: character.currentLocation,
      destinationLocationKey,
    });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const destinationSummary = getTravelDestinationSummary(destinationLocationKey);
    const fromLocationName = getLocationName(character.currentLocation);
    const travelCost = getTravelCost({
      currentLocationKey: character.currentLocation,
      destinationLocationKey,
    });
    const costValidationError = getTravelCostValidationError({
      stamina: character.stamina,
      travelCost,
    });

    if (costValidationError) {
      return res.status(400).json({ error: costValidationError });
    }

    const staminaAfter = Math.max(0, character.stamina - travelCost.staminaCost);
    const stressAfter = character.stress + travelCost.stressGain;

    const updatedCharacter = await prisma.$transaction(async (tx) => {
      const traveledCharacter = await tx.character.update({
        where: { id: character.id },
        data: {
          currentLocation: destinationLocationKey,
          stamina: staminaAfter,
          stress: stressAfter,
        },
        select: {
          id: true,
          name: true,
          currentLocation: true,
          stamina: true,
          maxStamina: true,
          stress: true,
        },
      });

      await createActivityLog(
        {
          characterId: character.id,
          type: "travel_completed",
          title: "Travel Completed",
          description: "The road carried another step into memory.",
          details: {
            characterName: character.name,
            fromLocationKey: character.currentLocation,
            fromLocationName,
            destinationLocationKey,
            destinationLocationName: destinationSummary.name,
            destinationRealmKey: destinationSummary.realmKey,
            destinationRealmName: destinationSummary.realmName,
            staminaCost: travelCost.staminaCost,
            stressGain: travelCost.stressGain,
            staminaBefore: character.stamina,
            staminaAfter,
            stressBefore: character.stress,
            stressAfter,
          },
        },
        tx,
      );

      return traveledCharacter;
    });

    return res.status(200).json({
      message: "Travel completed.",
      character: {
        id: updatedCharacter.id,
        name: updatedCharacter.name,
        currentLocation: updatedCharacter.currentLocation,
        currentLocationName: destinationSummary.name,
        stamina: updatedCharacter.stamina,
        maxStamina: updatedCharacter.maxStamina,
        stress: updatedCharacter.stress,
      },
      travelCost,
      destination: destinationSummary,
    });
  } catch (error) {
    console.error("Character travel API failed:", error);
    return res.status(500).json({ error: "Travel request failed." });
  }
}
