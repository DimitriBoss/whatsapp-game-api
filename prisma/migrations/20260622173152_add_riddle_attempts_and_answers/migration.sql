-- AlterTable
ALTER TABLE "game_sessions" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "answer" TEXT;
