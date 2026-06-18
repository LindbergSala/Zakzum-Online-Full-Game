-- AlterTable
ALTER TABLE "Character" ALTER COLUMN "currentLocation" SET DEFAULT 'kingstone';

-- Normalize existing local rows from display names to stable location keys.
UPDATE "Character"
SET "currentLocation" = 'kingstone'
WHERE "currentLocation" = 'Kingstone';
