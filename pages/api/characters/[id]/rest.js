import { getCurrentUser } from "../../../../lib/auth/currentUser";
import { createActivityLog } from "../../../../lib/game/activityLog";
import {
  getRestResult,
  getRestValidationError,
} from "../../../../lib/game/restRules";
import prisma from "../../../../lib/prisma";

function getCharacterId(req) {
  return Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
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

    const character = await getOwnedCharacter(getCharacterId(req), user.id);

    if (!character) {
      return res.status(404).json({ error: "Character not found." });
    }

    const validationError = getRestValidationError({
      stamina: character.stamina,
      maxStamina: character.maxStamina,
      stress: character.stress,
    });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const restResult = getRestResult({
      stamina: character.stamina,
      maxStamina: character.maxStamina,
      stress: character.stress,
    });

    if (!restResult) {
      return res.status(400).json({ error: "Rest could not be calculated." });
    }

    const updatedCharacter = await prisma.$transaction(async (tx) => {
      const restedCharacter = await tx.character.update({
        where: { id: character.id },
        data: {
          stamina: restResult.staminaAfter,
          stress: restResult.stressAfter,
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
          type: "rest_completed",
          title: "Rest Completed",
          description: "A pause from the road steadied body and mind.",
          details: {
            characterName: character.name,
            locationKey: character.currentLocation,
            staminaBefore: restResult.staminaBefore,
            staminaAfter: restResult.staminaAfter,
            maxStamina: restResult.maxStamina,
            stressBefore: restResult.stressBefore,
            stressAfter: restResult.stressAfter,
            staminaRecovered: restResult.staminaRecovered,
            stressReduced: restResult.stressReduced,
          },
        },
        tx,
      );

      return restedCharacter;
    });

    return res.status(200).json({
      message: "Rest completed.",
      character: {
        id: updatedCharacter.id,
        name: updatedCharacter.name,
        currentLocation: updatedCharacter.currentLocation,
        stamina: updatedCharacter.stamina,
        maxStamina: updatedCharacter.maxStamina,
        stress: updatedCharacter.stress,
      },
      restResult,
    });
  } catch (error) {
    console.error("Character rest API failed:", error);
    return res.status(500).json({ error: "Rest request failed." });
  }
}
