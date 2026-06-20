import { getCurrentUser } from "../auth/currentUser";
import prisma from "../prisma";

const CHARACTER_SELECT = {
  id: true,
  name: true,
  race: true,
  characterClass: true,
  level: true,
  experience: true,
  gold: true,
  stamina: true,
  maxStamina: true,
  stress: true,
  renown: true,
  currentLocation: true,
  createdAt: true,
};

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
    createdAt: character.createdAt.toISOString(),
  };
}

function getCharacterId(context) {
  return Array.isArray(context.params?.id)
    ? context.params.id[0]
    : context.params?.id;
}

export async function getCharacterPageServerSideProps(context) {
  const user = await getCurrentUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const characterId = getCharacterId(context);
  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      userId: user.id,
    },
    select: CHARACTER_SELECT,
  });

  if (!character) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      character: toSafeCharacter(character),
    },
  };
}