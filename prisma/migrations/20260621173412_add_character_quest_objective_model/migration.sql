-- CreateTable
CREATE TABLE "CharacterQuestObjective" (
    "id" TEXT NOT NULL,
    "characterQuestId" TEXT NOT NULL,
    "objectiveKey" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterQuestObjective_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CharacterQuestObjective_characterQuestId_idx" ON "CharacterQuestObjective"("characterQuestId");

-- CreateIndex
CREATE INDEX "CharacterQuestObjective_objectiveKey_idx" ON "CharacterQuestObjective"("objectiveKey");

-- CreateIndex
CREATE INDEX "CharacterQuestObjective_isCompleted_idx" ON "CharacterQuestObjective"("isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterQuestObjective_characterQuestId_objectiveKey_key" ON "CharacterQuestObjective"("characterQuestId", "objectiveKey");

-- AddForeignKey
ALTER TABLE "CharacterQuestObjective" ADD CONSTRAINT "CharacterQuestObjective_characterQuestId_fkey" FOREIGN KEY ("characterQuestId") REFERENCES "CharacterQuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
