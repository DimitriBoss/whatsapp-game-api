import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début du seed...');

  // On supprime les questions existantes pour éviter les doublons
  await prisma.question.deleteMany();
  console.log('🗑️  Anciennes questions supprimées.');

  await prisma.question.createMany({
    data: [
      // ─── ACTION (10 questions) ───────────────────────────────────────────
      {
        text: "Imite le cri d'un animal de ton choix pendant 10 secondes.",
        type: 'ACTION',
      },
      {
        text: "Fais 10 pompes sans t'arrêter.",
        type: 'ACTION',
      },
      {
        text: 'Chante le début de ta chanson préférée.',
        type: 'ACTION',
      },
      {
        text: "Envoie un message vocal en imitant la voix d'un bébé.",
        type: 'ACTION',
      },
      {
        text: 'Raconte une blague. Si personne ne rit, tu recommences.',
        type: 'ACTION',
      },
      {
        text: "Fais semblant d'être un robot pendant 2 minutes.",
        type: 'ACTION',
      },
      {
        text: "Envoie un message vocal en disant 'Je t'aime' à la personne de ton choix dans le groupe.",
        type: 'ACTION',
      },
      {
        text: 'Fais une danse de 20 secondes et envoie la vidéo.',
        type: 'ACTION',
      },
      {
        text: 'Mange quelque chose épicé et réagis en vocal.',
        type: 'ACTION',
      },
      {
        text: 'Imite un présentateur de journal télévisé pendant 30 secondes.',
        type: 'ACTION',
      },

      // ─── VÉRITÉ (10 questions) ───────────────────────────────────────────
      {
        text: "Quelle est ta plus grande peur dans la vie ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la chose la plus embarrassante qui t'est arrivée ?",
        type: 'VERITE',
      },
      {
        text: 'Si tu pouvais changer une chose dans ta vie, laquelle serait-ce ?',
        type: 'VERITE',
      },
      {
        text: 'Quel est ton secret le mieux gardé ? (celui que tu peux partager 😄)',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà menti à quelqu'un que tu aimes ? Raconte.",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la chose dont tu es le plus fier(e) dans ta vie ?',
        type: 'VERITE',
      },
      {
        text: "Qui dans ce groupe t'impressionne le plus et pourquoi ?",
        type: 'VERITE',
      },
      {
        text: "Quel est ton défaut que tu n'aimes pas avouer ?",
        type: 'VERITE',
      },
      {
        text: 'Si tu devais décrire ta vie en un seul mot, lequel choisirais-tu ?',
        type: 'VERITE',
      },
      {
        text: "Quelle est la chose la plus courageuse que tu aies jamais faite ?",
        type: 'VERITE',
      },

      // ─── DEVINETTE (10 questions) ────────────────────────────────────────
      {
        text: "Je parle sans bouche, j'entends sans oreilles. Qu'est-ce que je suis ?",
        answer: "echo",
        type: 'DEVINETTE',
      },
      {
        text: "Plus je sèche, plus je suis mouillée. Qu'est-ce que je suis ?",
        answer: "serviette",
        type: 'DEVINETTE',
      },
      {
        text: "J'ai des dents mais je ne mords pas. Qu'est-ce que je suis ?",
        answer: "peigne",
        type: 'DEVINETTE',
      },
      {
        text: "Je cours mais je n'ai pas de jambes. Qu'est-ce que je suis ?",
        answer: "eau|riviere",
        type: 'DEVINETTE',
      },
      {
        text: "Plus on m'enlève, plus je deviens grande. Qu'est-ce que je suis ?",
        answer: "trou",
        type: 'DEVINETTE',
      },
      {
        text: "J'ai une tête et une queue mais pas de corps. Qu'est-ce que je suis ?",
        answer: "piece|monnaie",
        type: 'DEVINETTE',
      },
      {
        text: "Je suis toujours devant toi mais tu ne peux jamais me toucher. Qu'est-ce que je suis ?",
        answer: "avenir|futur",
        type: 'DEVINETTE',
      },
      {
        text: "Tout le monde me soulève mais personne ne peut me tenir longtemps. Qu'est-ce que je suis ?",
        answer: "souffle",
        type: 'DEVINETTE',
      },
      {
        text: "Je suis rond, je tourne, je guide les voyageurs. Qu'est-ce que je suis ?",
        answer: "boussole",
        type: 'DEVINETTE',
      },
      {
        text: "Je suis la fille de l'eau mais si l'eau me touche, je meurs. Qu'est-ce que je suis ?",
        answer: "glace",
        type: 'DEVINETTE',
      },
    ],
  });

  console.log('✅ 30 questions insérées (10 ACTION, 10 VÉRITÉ, 10 DEVINETTE)');
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
