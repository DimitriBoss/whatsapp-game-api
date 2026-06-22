-- CreateEnum
CREATE TYPE "BotState" AS ENUM ('START', 'AWAITING_NAME', 'MAIN_MENU', 'PLAYING_ACTION_VERITE', 'PLAYING_DEVINETTE');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('ACTION', 'VERITE', 'DEVINETTE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "botState" "BotState" NOT NULL DEFAULT 'START',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" UUID NOT NULL,
    "chatId" TEXT NOT NULL,
    "currentQuestionId" UUID,
    "history" UUID[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "game_sessions_chatId_key" ON "game_sessions"("chatId");
