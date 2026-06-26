require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { MorpionService } = require('./dist/games/morpion/morpion.service');
const { GameService } = require('./dist/game/game.service');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const gameService = new GameService(prisma);
  const morpionService = new MorpionService(prisma, gameService);

  const chatId = 'test-morpion-user@c.us';

  console.log('1. Creating test user and clearing session...');
  await prisma.user.upsert({
    where: { phoneNumber: chatId },
    update: { botState: 'PLAYING_MORPION' },
    create: { phoneNumber: chatId, botState: 'PLAYING_MORPION' },
  });

  await prisma.gameSession.upsert({
    where: { chatId },
    update: { currentGame: null, gameData: null, currentQuestionId: null },
    create: { chatId, currentGame: null, gameData: null },
  });

  console.log('2. Starting Solo Morpion...');
  const startMsg = await morpionService.startSoloGame(chatId, 'HARD');
  console.log('Start Message:\n', startMsg);

  let session = await prisma.gameSession.findUnique({ where: { chatId } });
  console.log('Session after start:', JSON.stringify(session, null, 2));

  console.log('3. Playing move 5...');
  const moveMsg = await morpionService.handleSoloMove(chatId, chatId, '5', session.gameData);
  console.log('Move Response:\n', moveMsg);

  session = await prisma.gameSession.findUnique({ where: { chatId } });
  console.log('Session after move 5:', JSON.stringify(session, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
