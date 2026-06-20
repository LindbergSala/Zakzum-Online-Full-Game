-- CreateEnum
CREATE TYPE "QuestProgressStatus" AS ENUM ('ACCEPTED', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "CharacterQuest" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "questKey" TEXT NOT NULL,
    "status" "QuestProgressStatus" NOT NULL DEFAULT 'ACCEPTED',
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterQuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CharacterQuest_characterId_idx" ON "CharacterQuest"("characterId");

-- CreateIndex
CREATE INDEX "CharacterQuest_questKey_idx" ON "CharacterQuest"("questKey");

-- CreateIndex
CREATE INDEX "CharacterQuest_status_idx" ON "CharacterQuest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterQuest_characterId_questKey_key" ON "CharacterQuest"("characterId", "questKey");

-- AddForeignKey
ALTER TABLE "CharacterQuest" ADD CONSTRAINT "CharacterQuest_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
