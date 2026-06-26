require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function normalizeText(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function main() {
  console.log('Fetching all devinette questions...');
  const devinettes = await prisma.question.findMany({
    where: { type: 'DEVINETTE' },
  });

  console.log(`Found ${devinettes.length} devinettes.`);

  // Test matching logic for each
  for (const q of devinettes) {
    if (!q.answer) {
      console.log(`⚠️ Question ${q.id} has no answer!`);
      continue;
    }
    const options = q.answer.split('|');
    
    // Simulate user answering with first option
    const testAnswer1 = options[0];
    const normalizedUserAnswer1 = normalizeText(testAnswer1);
    const isCorrect1 = options.some((opt) => normalizedUserAnswer1.includes(normalizeText(opt)));

    if (!isCorrect1) {
      console.log(`❌ Failed matching for Question ID: ${q.id}`);
      console.log(`Question: ${q.text}`);
      console.log(`Expected Answers: ${q.answer}`);
      console.log(`Test Input: "${testAnswer1}"`);
      console.log(`Normalized User Answer: "${normalizedUserAnswer1}"`);
      console.log(`Normalized Options:`, options.map(opt => normalizeText(opt)));
      console.log('---');
    }
  }
  console.log('Verification finished.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
