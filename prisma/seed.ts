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
      // ─── ACTION (40 questions) ───────────────────────────────────────────
      {
        text: 'Envoie un vocal de 15 secondes où tu imites un Zémidjan en train de négocier un prix de 300F sous le soleil.',
        type: 'ACTION',
      },
      {
        text: "Fais une capture d'écran de ton solde Mobile Money (MTN, Celtiis ou Moov) et envoie-la dans le groupe.",
        type: 'ACTION',
      },
      {
        text: 'Danse sur le rythme afro ou hiphop de ton choix pendant 20 secondes et envoie la vidéo.',
        type: 'ACTION',
      },
      {
        text: "Mets en statut WhatsApp : 'C'est décidé, je deviens vendeur de Atassi' et laisse-le 30 minutes.",
        type: 'ACTION',
      },
      {
        text: "Appelle un de tes parents et dis-lui juste 'J'ai perdu mon téléphone' depuis ton propre téléphone, puis raccroche.",
        type: 'ACTION',
      },
      {
        text: "Fais une déclaration d'amour très sérieuse à un plat de moyo bien garni en note vocale.",
        type: 'ACTION',
      },
      {
        text: "Envoie un message à ton ex en disant : 'Il faut qu'on parle du terrain qu'on a acheté à Calavi'.",
        type: 'ACTION',
      },
      {
        text: 'Parle avec un fort accent ivoirien ou congolais pendant tes 3 prochaines interventions.',
        type: 'ACTION',
      },
      {
        text: "Dessine rapidement une affiche imaginaire sur un bout de papier pour une 'moyo party', ajoute la mention 'contact officiel' en bas, et envoie la photo.",
        type: 'ACTION',
      },
      {
        text: 'Prends un peu de piment cru ou de la pâte de piment, mets sur ta langue et envoie un vocal de ta réaction.',
        type: 'ACTION',
      },
      {
        text: "Envoie un message à ton boss ou ton prof disant : 'Le boss, on gère comment pour ce soir ?' et supprime-le juste après.",
        type: 'ACTION',
      },
      {
        text: "Imite la voix d'un animateur de radio locale qui fait des dédicaces à Dantokpa.",
        type: 'ACTION',
      },
      {
        text: 'Fais 15 pompes en criant le nom de ton quartier à chaque descente.',
        type: 'ACTION',
      },
      {
        text: "Va dans tes contacts, choisis le 10ème numéro et envoie-lui le message : 'Tu me dois 2000F depuis 2019'.",
        type: 'ACTION',
      },
      {
        text: "Chante le générique d'une vieille Télénovela (Marimar, La Chacala) avec toute l'émotion possible.",
        type: 'ACTION',
      },
      {
        text: 'Essaie de vendre un objet à côté de toi comme un vendeur de remèdes traditionnels dans un bus.',
        type: 'ACTION',
      },
      {
        text: "Laisse les autres joueurs écrire un statut WhatsApp sur ton téléphone. Tu ne peux l'effacer qu'après 15 minutes.",
        type: 'ACTION',
      },
      {
        text: "Envoie un selfie faisant la grimace la plus laide possible avec la légende 'Je suis frais/fraîche non ?'.",
        type: 'ACTION',
      },
      {
        text: "Simule un commentaire de match de football de l'équipe nationale à la télé béninoise pendant 30 secondes.",
        type: 'ACTION',
      },
      {
        text: "Fais une pub audio complètement décalée pour un menu digital de restaurant appelé 'dessertIT'.",
        type: 'ACTION',
      },
      {
        text: "Envoie le message 'Je crois que mon code React est cassé' à quelqu'un qui ne connaît rien en informatique.",
        type: 'ACTION',
      },
      {
        text: "Bois un grand verre d'eau sans utiliser tes mains.",
        type: 'ACTION',
      },
      {
        text: "Imite la démarche de quelqu'un qui vient de manger beaucoup trop d'igname pilée.",
        type: 'ACTION',
      },
      {
        text: 'Envoie un vocal où tu essaies de chanter un son de GG Vikey ou Zeynab.',
        type: 'ACTION',
      },
      {
        text: "Fais semblant d'être un influenceur(se) béninois(e) qui fait un placement de produit pour du gari.",
        type: 'ACTION',
      },
      {
        text: 'Mets ton téléphone en mode avion pendant 10 minutes.',
        type: 'ACTION',
      },
      {
        text: "Envoie un message WhatsApp avec uniquement des emojis pour raconter ta journée d'hier.",
        type: 'ACTION',
      },
      {
        text: 'Change ta photo de profil pour une photo de mouton pendant les 2 prochaines heures.',
        type: 'ACTION',
      },
      {
        text: "Imite le bruit du groupe électrogène du quartier qui s'allume après une coupure de la SBEE.",
        type: 'ACTION',
      },
      {
        text: "Poste un statut texte disant : 'C'est décidé, je me marie l'année prochaine' et ne réponds à personne.",
        type: 'ACTION',
      },
      {
        text: 'Fais un compliment très gênant à la personne avec qui tu joues.',
        type: 'ACTION',
      },
      {
        text: "Envoie un vocal où tu tousses de façon exagérée et dis 'C'est la poussière de Calavi'.",
        type: 'ACTION',
      },
      {
        text: "Ferme les yeux, fais défiler tes contacts au hasard et envoie 'Tu me manques' à la personne sur qui tu tombes.",
        type: 'ACTION',
      },
      {
        text: "Récite l'alphabet à l'envers le plus vite possible en note vocale.",
        type: 'ACTION',
      },
      {
        text: "Fais semblant de pleurer parce qu'il n'y a plus de fromage (wagasi) dans la sauce.",
        type: 'ACTION',
      },
      {
        text: 'Explique en détail et très sérieusement comment on prépare un bon Akassa.',
        type: 'ACTION',
      },
      {
        text: 'Envoie un selfie de toi avec un objet sur la tête en équilibre.',
        type: 'ACTION',
      },
      {
        text: 'Mime une scène de drague dans une buvette de quartier.',
        type: 'ACTION',
      },
      {
        text: 'Montre ton historique de recherche Google (ou avoue la dernière chose que tu as cherchée).',
        type: 'ACTION',
      },
      {
        text: 'Envoie un message vocal en parlant au ralenti pendant 20 secondes.',
        type: 'ACTION',
      },
      {
        text: "Envoie un message à ta mère disant 'Maman, je me marie la semaine prochaine' et screenshot sa réponse.",
        type: 'ACTION',
      },
      {
        text: "Fais une note vocale où tu cries le nom de ton/ta crush actuel(le) à la manière d'un crieur public de quartier.",
        type: 'ACTION',
      },
      {
        text: 'Fais le tour de la pièce en marchant sur les genoux pendant 1 minute.',
        type: 'ACTION',
      },
      {
        text: 'Dessine le drapeau du Bénin sur ton visage (ou ton bras) avec un stylo et envoie la photo.',
        type: 'ACTION',
      },
      {
        text: 'Laisse le groupe choisir ta photo de profil WhatsApp pendant les 24 prochaines heures.',
        type: 'ACTION',
      },
      {
        text: "Appelle une boutique ou un maquis du coin et commande 'un plat de caviar et du champagne' de manière très sérieuse.",
        type: 'ACTION',
      },
      {
        text: 'Fais un discours de remerciement de 30 secondes comme si tu venais de gagner un prix pour la meilleure préparation de pâte noire (Amala).',
        type: 'ACTION',
      },
      {
        text: "Mets une photo de toi très embarrassante en statut WhatsApp avec la légende 'Je suis un vrai pain' pendant 1 heure.",
        type: 'ACTION',
      },
      {
        text: "Mange une petite poignée de gari sec sans boire d'eau pendant 1 minute (ou mets de la farine dans ta bouche).",
        type: 'ACTION',
      },
      {
        text: "Imite la façon de parler d'un professeur d'université (de l'UAC) qui refuse de donner des bonnes notes.",
        type: 'ACTION',
      },
      {
        text: "Envoie un message vocal à ton ex : 'Finalement, j'ai réalisé que c'était toi le problème.' (Ou à un ami si pas d'ex).",
        type: 'ACTION',
      },
      {
        text: "Fais le bruit de quelqu'un qui aspire goulûment un os de mouton dans une bonne sauce graine.",
        type: 'ACTION',
      },
      {
        text: 'Raconte la pire blague que tu connaisses en vocal. Si personne ne rit, fais 5 pompes.',
        type: 'ACTION',
      },
      {
        text: "Laisse quelqu'un d'autre écrire un message à la 5ème personne de ta liste de discussion WhatsApp.",
        type: 'ACTION',
      },
      {
        text: "Mets du rouge à lèvres (ou dessine avec un stylo) et fais un bisou sur ton téléphone, puis envoie la photo de l'écran.",
        type: 'ACTION',
      },
      {
        text: "Imite un vendeur ambulant de 'Kluiklui' (galettes d'arachide) qui essaie de convaincre un client réticent.",
        type: 'ACTION',
      },
      {
        text: 'Fais un massage des épaules virtuel (en le mimant de façon très sérieuse devant la caméra/en vidéo) à la personne de ton choix.',
        type: 'ACTION',
      },
      {
        text: 'Envoie un vocal où tu essaies de parler une langue locale (Fon, Yoruba, Mina) mais avec un accent français très exagéré.',
        type: 'ACTION',
      },
      {
        text: "Bois une gorgée d'eau et garde-la dans la bouche pendant qu'on te raconte une blague. Si tu craches, tu as un gage.",
        type: 'ACTION',
      },
      {
        text: "Prends un balai et fais une performance de guitare électrique dessus en t'enregistrant.",
        type: 'ACTION',
      },
      {
        text: "Écris à ton père ou ton tuteur : 'J'ai besoin de 500.000 FCFA pour un projet top secret. Fais le transfert via Momo.' et montre la réponse.",
        type: 'ACTION',
      },
      {
        text: "Filme-toi en train d'essayer de jongler avec 3 paires de chaussettes en boule ou 3 citrons.",
        type: 'ACTION',
      },
      {
        text: "Envoie le dernier mème de ta galerie, même s'il n'a aucun sens.",
        type: 'ACTION',
      },
      {
        text: 'Imite un(e) Béninois(e) de la diaspora qui rentre au pays pour les vacances de décembre et se plaint de la chaleur.',
        type: 'ACTION',
      },
      {
        text: 'Attache un pagne autour de ta taille et fais une démonstration de danse traditionnelle de chez toi.',
        type: 'ACTION',
      },
      {
        text: "Fais semblant d'être un pasteur dans une église de réveil en pleine séance de délivrance pendant 30 secondes en vocal.",
        type: 'ACTION',
      },
      {
        text: "Appelle un contact au hasard et chante-lui 'Joyeux Anniversaire' sans dire pourquoi.",
        type: 'ACTION',
      },
      {
        text: "Fais un poème d'amour de 4 lignes dédié au 'Wagasi' (fromage peulh).",
        type: 'ACTION',
      },
      {
        text: "Envoie 'Je sais ce que tu as fait hier soir' au 3ème contact de ton répertoire et ne réponds plus.",
        type: 'ACTION',
      },
      {
        text: "Imite un chargeur de taxi interurbain qui crie : 'Cotonou-Porto, Cotonou-Porto, il reste une place !'.",
        type: 'ACTION',
      },
      {
        text: 'Mange un mélange bizarre (ex: du pain avec de la sauce piquante ou du sucre).',
        type: 'ACTION',
      },
      {
        text: "Ouvre ta porte ou ta fenêtre et crie 'La vie est belle au 229 !' le plus fort possible.",
        type: 'ACTION',
      },
      {
        text: 'Fais le poirier (ou essaie de te tenir contre un mur la tête en bas) pendant 10 secondes en vidéo.',
        type: 'ACTION',
      },
      {
        text: "Trouve un objet rouge dans la pièce et fais-lui une déclaration d'amour digne d'un film Nollywood.",
        type: 'ACTION',
      },
      {
        text: "Filme-toi en train de boire de l'eau comme si c'était la meilleure boisson du monde après une traversée du désert.",
        type: 'ACTION',
      },
      {
        text: "Dis l'alphabet à l'envers très vite en vocal. À chaque erreur, tu dois recommencer.",
        type: 'ACTION',
      },
      {
        text: "Fais une grimace d'un enfant béninois qui pleure parce qu'on lui a refusé un biscuit.",
        type: 'ACTION',
      },
      {
        text: "Envoie un vocal où tu fais la respiration de Dark Vador en disant 'Je suis ton Zémidjan'.",
        type: 'ACTION',
      },
      {
        text: 'Fais 10 squats en tenant un objet lourd (livre, bouteille) au-dessus de ta tête.',
        type: 'ACTION',
      },
      {
        text: 'Reproduis ton emoji préféré avec ton visage, prends un selfie et envoie-le.',
        type: 'ACTION',
      },
      {
        text: 'Fais un pas de danse afro ou hiphop pendant 15 secondes et envoie la vidéo.',
        type: 'ACTION',
      },
      {
        text: 'Envoie une note vocale où tu expliques la différence entre un développeur et un réparateur de téléphones (ce que les tantes croient).',
        type: 'ACTION',
      },
      {
        text: "Imite la voix du responsable de ton association qui s'énerve pour les absences répétées aux réunions ou aux répétitions.",
        type: 'ACTION',
      },
      {
        text: "Dessine rapidement sur papier un logo pour un restaurant fictif appelé 'dessertIT' et envoie la photo.",
        type: 'ACTION',
      },
      {
        text: "Prends un accent très 'frais' (béninois qui revient d'Europe) pour demander le prix du gari au marché.",
        type: 'ACTION',
      },
      {
        text: "Envoie un message à un ami disant 'J'ai gagné 1 million sur 1xBet hier' et capture sa réaction.",
        type: 'ACTION',
      },
      {
        text: "Crie 'Agbééé' (comme au stade de l'Amitié) avec la voix la plus aiguë possible en vocal.",
        type: 'ACTION',
      },
      {
        text: "Crie 'La fibre optique est enfin arrivée dans mon quartier !' par la fenêtre.",
        type: 'ACTION',
      },
      {
        text: 'Imite un joueur de PES ou eFootball qui vient de prendre un but à la 90ème minute en difficulté Légende.',
        type: 'ACTION',
      },
      {
        text: "Fais 5 squats en prononçant le nom d'une technologie (React, MongoDB, NestJS) à chaque descente.",
        type: 'ACTION',
      },
      {
        text: "Mime la démarche lente et frustrante d'une connexion internet qui rame pendant le téléchargement d'un gros fichier.",
        type: 'ACTION',
      },
      {
        text: "Tape-toi le front en soupirant fortement et en disant 'Akaaa' comme un papa découragé.",
        type: 'ACTION',
      },
      {
        text: "Fais le 'tchip' béninois le plus long, le plus profond et le plus sonore possible en vocal.",
        type: 'ACTION',
      },
      {
        text: "Envoie le 7ème mème de ta galerie d'images, sans aucune explication contextuelle.",
        type: 'ACTION',
      },
      {
        text: "Essaie de prononcer 'Mahougnon Gnonlonfoun' très vite 5 fois de suite sans bégayer.",
        type: 'ACTION',
      },
      {
        text: 'Fais semblant de chercher frénétiquement de la monnaie dans tes poches devant un Zémidjan imaginaire.',
        type: 'ACTION',
      },
      {
        text: "Écris 'Je suis amoureux de l'intelligence artificielle' en statut WhatsApp et laisse-le 15 minutes.",
        type: 'ACTION',
      },
      {
        text: 'Imite un vendeur de crédit et transfert Mobile Money assis sous son parasol au soleil.',
        type: 'ACTION',
      },
      {
        text: "Ferme les yeux et essaie de taper 'Le Bénin est le meilleur pays' sur le clavier de ton téléphone, puis envoie le résultat.",
        type: 'ACTION',
      },
      {
        text: "Prends la pose de ton footballeur préféré lors d'une célébration de but et envoie la photo.",
        type: 'ACTION',
      },

      // ─── VÉRITÉ (40 questions) ───────────────────────────────────────────
      {
        text: 'Quel est le pire mensonge que tu as sorti à tes parents pour aller à une soirée ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà rédigé un message hyper formel à ton association (comme l'EACE) pour te plaindre des absences, alors que toi-même tu voulais rester dormir ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est ta pire crise de rage après avoir perdu un match sur eFootball ou PES (surtout en difficulté Légende) ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà dit 'Je suis déjà au carrefour' au Zém alors que tu n'étais même pas encore habillé(e) ?",
        type: 'VERITE',
      },
      {
        text: "Quel est le surnom le plus honteux qu'on te donnait au quartier quand tu étais petit(e) ?",
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà pleuré de frustration devant une erreur dans ton code (genre NestJS, React Native ou Vite) ?',
        type: 'VERITE',
      },
      {
        text: 'Quel est ton pire souvenir lié à une coupure de la SBEE au mauvais moment ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà volé un gros morceau de viande dans la marmite en cachette ?',
        type: 'VERITE',
      },
      {
        text: "Quel est le montant maximum que tu as dépensé pour impressionner quelqu'un lors d'un 'date' ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà été dragué(e) ou dragué quelqu'un dans un taxi Tokpa-Calavi ?",
        type: 'VERITE',
      },
      {
        text: "Quelle application caches-tu le plus vite quand quelqu'un regarde ton écran ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà fait semblant d'être au téléphone pour éviter de saluer quelqu'un ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà porté un habit de Missèbo en faisant croire que ça venait d'une boutique de luxe ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la punition la plus traumatisante que tes parents t'ont infligée ?",
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà lu les messages WhatsApp de ton/ta partenaire en cachette ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà fait semblant de maîtriser une danse juste pour impressionner une fille ou un gars en soirée ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà utilisé le wifi d'un voisin à son insu ?",
        type: 'VERITE',
      },
      {
        text: 'Quel est le message le plus embarrassant que tu aies envoyé dans le mauvais groupe WhatsApp ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà eu des sentiments pour le ou la partenaire d'un de tes amis ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la chose la plus ridicule que tu aies faite par jalousie ?',
        type: 'VERITE',
      },
      {
        text: "Si tu devenais millionnaire grâce à des contrats en freelance international d'ici un an, quelle est la première folie que tu ferais ?",
        type: 'VERITE',
      },
      { text: 'Quel est ton pire défaut en amitié ?', type: 'VERITE' },
      {
        text: "As-tu déjà menti sur ton âge pour plaire à quelqu'un ?",
        type: 'VERITE',
      },
      {
        text: 'Quel est le dernier rêve bizarre ou gênant dont tu te souviens ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà fouillé le téléphone d'un membre de ta famille ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la rumeur la plus folle que tu aies entendue sur toi ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà créé un faux compte sur les réseaux sociaux pour surveiller quelqu'un ?",
        type: 'VERITE',
      },
      {
        text: 'Quel est ton plus grand regret de cette année ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà pris un article au supermarché (comme Erevan) pour le reposer discrètement après avoir vu le prix ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà fait exprès de ne pas répondre à un vocal WhatsApp de plus de 2 minutes ?',
        type: 'VERITE',
      },
      { text: 'Quelle est ta phobie la plus inavouable ?', type: 'VERITE' },
      {
        text: "As-tu déjà menti pour ne pas prêter de l'argent à un ami ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la note la plus catastrophique que tu aies eue à l'école, et l'as-tu cachée ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà regretté d'avoir embrassé quelqu'un le lendemain matin ?",
        type: 'VERITE',
      },
      {
        text: 'Qui est la personne la moins bien habillée que tu connaisses (sans dire son nom complet) ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà laissé un plat brûler sur le feu parce que tu étais trop concentré(e) sur ton téléphone ?',
        type: 'VERITE',
      },
      {
        text: "Quel est le pire cadeau que l'on t'ait jamais offert ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà fait une crise de jalousie pour un simple 'like' sur Instagram ou Facebook ?",
        type: 'VERITE',
      },
      {
        text: 'Si tu pouvais effacer une journée de ta vie, laquelle ce serait ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà gardé la monnaie des commissions de tes parents quand tu étais plus jeune ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà subi un 'goumin' (chagrin d'amour) sévère causé par quelqu'un que tout le monde trouvait moins beau/belle que toi ?",
        type: 'VERITE',
      },
      {
        text: 'Quel est le repas béninois que tout le monde adore mais que tu détestes secrètement ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà fouillé dans le téléphone de ton petit ami / ta petite amie pour y trouver des preuves de tromperie ?',
        type: 'VERITE',
      },
      {
        text: 'Quel est le montant exact de ton solde Mobile Money en ce moment précis ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà 'mangé' l'argent de ta propre scolarité ou de la tontine ?",
        type: 'VERITE',
      },
      {
        text: "Quel est le pire cadeau que tu as offert à quelqu'un juste parce que tu n'avais pas d'argent ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est l'excuse la plus bidon que tu as donnée à un professeur (ou à un boss) pour un retard ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà utilisé le parfum ou le déodorant de quelqu'un d'autre sans lui dire ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la dernière personne que tu as 'stalkée' (espionnée) sur Instagram ou Facebook ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà été secrètement jaloux(se) du succès financier ou professionnel d'un de tes amis ?",
        type: 'VERITE',
      },
      {
        text: "Quel est le pire plat que tu aies jamais cuisiné et que tu as forcé quelqu'un à manger en souriant ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà fait semblant de dormir pour éviter d'aider aux tâches ménagères (faire la vaisselle, balayer) ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la chose la plus chère que tu as gâtée ou cassée chez tes parents sans jamais l'avouer ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà porté des sous-vêtements à l'envers par manque de courage pour faire la lessive ?",
        type: 'VERITE',
      },
      {
        text: "Quel est le pire 'râteau' (rejet) que tu as pris en tentant d'aborder quelqu'un ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà menti sur le quartier où tu habites pour paraître plus 'frais' (genre dire Haie Vive au lieu de Vêdoko) ?",
        type: 'VERITE',
      },
      {
        text: "Si tu devais échanger ta vie avec l'un des joueurs présents dans ce chat, ce serait qui et pourquoi ?",
        type: 'VERITE',
      },
      {
        text: 'Quel est le plus gros mensonge technique que tu as mis sur ton CV pour trouver un stage ou un job ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà pleuré pour un(e) ex que tu faisais semblant de détester en public ?',
        type: 'VERITE',
      },
      {
        text: "Quelle est ta technique secrète pour aller gratter de la nourriture chez les amis à l'heure du déjeuner ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà pété en public et fait semblant que c'était le bruit d'une chaise ou d'une autre personne ?",
        type: 'VERITE',
      },
      {
        text: 'Quel est le nom du dernier contact que tu as bloqué sur WhatsApp et quelle était la raison exacte ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà secrètement espéré qu'un couple d'amis se sépare pour avoir ta chance avec l'un des deux ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la phobie la plus ridicule que tu as (peur des margouillats, des cafards volants, etc.) ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà créé un faux profil sur les réseaux pour tester la fidélité de ton/ta partenaire ?',
        type: 'VERITE',
      },
      {
        text: 'Si ton historique de navigation internet devait être lu à haute voix à ta mère, quelle serait ta réaction ?',
        type: 'VERITE',
      },
      {
        text: "Quel est l'endroit le plus bizarre ou honteux où tu t'es endormi(e) après une fête ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà regretté de t'être mis(e) en couple avec une personne juste après le premier mois ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la pire photo de toi qui existe et qui la détient actuellement ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà été chassé(e) d'une salle de classe ou d'un amphi à l'UAC ? Pourquoi ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est ton obsession la plus étrange en ce moment ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà volé l'idée de quelqu'un d'autre (un code, un design, une blague) et pris tout le crédit pour toi ?",
        type: 'VERITE',
      },
      {
        text: "Quel est le caprice d'enfant que tu fais encore aujourd'hui quand tu es contrarié(e) ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà feint d'aimer un artiste béninois que tu détestes juste pour plaire à la personne que tu draguais ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la chose la plus lâche que tu aies faite pour fuir une dispute de couple ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà caché ou falsifié un mauvais bulletin de notes à la maison ?',
        type: 'VERITE',
      },
      {
        text: 'Quel est le grand secret que tu as promis de garder mais que tu as fini par répéter à ton/ta meilleur(e) ami(e) ?',
        type: 'VERITE',
      },
      {
        text: "Si tu pouvais lire dans les pensées d'une personne dans cette partie, qui choisirais-tu ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà dragué un(e) Zemidjan juste pour qu'il te diminue le prix de la course ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la pire rumeur que tu as lancée ou relayée sur quelqu'un au quartier ou au campus ?",
        type: 'VERITE',
      },
      {
        text: "Quel est ton plus grand rêve professionnel ou objectif financier inavouable pour l'année prochaine grâce au freelance ?",
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà jeté ou cassé violemment la manette en jouant à PES ou eFootball ?',
        type: 'VERITE',
      },
      {
        text: 'Quelle est ton excuse classique et imbattable pour justifier ton absence à une assemblée générale ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà utilisé l'IA (comme Gemini ou Claude) pour écrire un message d'excuse ou rompre avec quelqu'un ?",
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà pris un Zém pour parcourir juste 200 mètres parce que tu avais une flemme internationale de marcher ?',
        type: 'VERITE',
      },
      {
        text: 'Quelle est la plus grosse galère ou crise de larmes que tu aies eue avec la plateforme Campus France ou Etudes en France ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà commandé sur Alibaba et reçu un article qui ne ressemblait absolument pas à la photo (ou des écouteurs bizarres) ?',
        type: 'VERITE',
      },
      {
        text: 'Quel est le repas préparé par ta mère que tu manges uniquement par politesse pour ne pas créer de problèmes ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà bloqué quelqu'un ou mis ton téléphone en silencieux parce qu'il te demandait trop souvent de dépanner son ordinateur ?",
        type: 'VERITE',
      },
      {
        text: "Quelle est la pire honte que tu aies eue en essayant de danser devant un public ou lors d'une fête ?",
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà fait semblant de comprendre parfaitement une blague en langue locale alors que tu étais complètement perdu(e) ?',
        type: 'VERITE',
      },
      {
        text: 'Si tu pouvais supprimer une application de tous les téléphones du Bénin pour la paix mondiale, ce serait laquelle ?',
        type: 'VERITE',
      },
      {
        text: 'As-tu déjà créé un faux profil sur un site de rencontre (comme JeContacte) par simple curiosité ou pour espionner ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà gonflé le prix d'un article que tu as acheté pour impressionner tes amis et faire le 'boss' ?",
        type: 'VERITE',
      },
      {
        text: "Quel est le dernier film, la dernière série ou vidéo YouTube que tu as regardé(e) en cachette et que tu n'assumes pas ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà supprimé un message WhatsApp 'pour tout le monde' en priant fort que la personne n'ait pas vu la notification ?",
        type: 'VERITE',
      },
      {
        text: 'Quelle est la chose la plus absurde que tu aies recherchée sur Google récemment pour un projet ?',
        type: 'VERITE',
      },
      {
        text: "As-tu déjà marché très vite en regardant ton téléphone pour éviter de donner une petite pièce à quelqu'un dans la rue ?",
        type: 'VERITE',
      },
      {
        text: "Si on fouillait ta galerie de photos là maintenant, quelle est la chose la plus difficile à expliquer qu'on y trouverait ?",
        type: 'VERITE',
      },
      {
        text: "As-tu déjà mangé l'argent de la commission (le reste de la monnaie) alors que tes parents t'avaient demandé de le ramener ?",
        type: 'VERITE',
      },

      // ─── DEVINETTE (40 questions) ────────────────────────────────────────
      {
        text: "Je suis souvent jaune, j'ai deux roues et je t'amène partout à Cotonou. Qui suis-je ?",
        answer: 'zemidjan|zem|kekeno',
        type: 'DEVINETTE',
      },
      {
        text: "On me célèbre pour la culture et les saveurs, mais ne m'appelle surtout pas 'monyo'. Qui suis-je ?",
        answer: 'moyo party',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis une petite boule rouge ou verte. On m'écrase sur la meule et je mets le feu aux repas. Qui suis-je ?",
        answer: 'piment',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis le plus grand marché à ciel ouvert de l'Afrique de l'Ouest. Qui suis-je ?",
        answer: 'dantokpa|tokpa',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un plat de riz et de haricots mélangés, souvent vendu au bord de la voie le matin.',
        answer: 'atassi|wachti',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis la société qui gère l'électricité. Les Béninois crient souvent mon nom quand la lumière coupe.",
        answer: 'sbee',
        type: 'DEVINETTE',
      },
      {
        text: "Sur une affiche professionnelle, on m'utilise en bas pour donner le numéro, je remplace le vieux 'sport officiel'. Qui suis-je ?",
        answer: 'contact officiel',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un réseau mobile au Bénin dont la couleur principale est le jaune.',
        answer: 'mtn',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un petit carré noir et blanc sur les tables de restaurant qui, une fois scanné, affiche le menu, comme le projet dessertIT. Qui suis-je ?',
        answer: 'qr code|code qr',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis la monnaie utilisée au Bénin et dans plusieurs pays d'Afrique de l'Ouest.",
        answer: 'fcfa|cfa|franc cfa',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis le fromage local béninois, souvent frit et rouge à l'extérieur.",
        answer: 'wangash|wagasi|fromage peulh|wagach|fromage',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'essence frelatée vendue au bord des voies dans des bouteilles en verre.",
        answer: 'kpayo|essence kpayo|essence|essence frelatee',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'animal emblématique de l'équipe nationale de football du Bénin.",
        answer: 'guepard|les guepards',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis la connexion internet la plus rapide pour la maison, qui passe par un fil de verre. Qui suis-je ?',
        answer: 'fibre optique|fibre',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis le long pont qui sépare Cotonou de sa commune voisine très peuplée.',
        answer: 'calavi|abomey-calavi',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une sauce gluante, verte, souvent appréciée avec la pâte noire (amala).',
        answer: 'crincrin|crin crin|crin-crin',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis le nouveau réseau de télécommunication aux couleurs du Bénin.',
        answer: 'celtiis',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un taxi interurbain à 4 roues, souvent jaune et vert, réputé pour faire entrer 6 passagers.',
        answer: 'taxi|tokpa tokpa',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une pâte de maïs fermentée, souvent emballée dans des feuilles, qui accompagne la friture.',
        answer: 'akassa',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'intelligence artificielle que tu interroges souvent pour générer du code ou des idées.",
        answer: 'ia|intelligence artificielle|gemini|claude',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une petite moto très populaire au Bénin, de marque indienne, souvent utilisée par les Zémidjans.',
        answer: 'bajaj',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis la boisson locale alcoolisée extraite du palmier à huile.',
        answer: 'sodabi|vin de palme',
        type: 'DEVINETTE',
      },
      {
        text: "Je parle sans bouche, j'entends sans oreilles. Qu'est-ce que je suis ?",
        answer: 'echo',
        type: 'DEVINETTE',
      },
      {
        text: "Plus je sèche, plus je suis mouillée. Qu'est-ce que je suis ?",
        answer: 'serviette',
        type: 'DEVINETTE',
      },
      {
        text: "J'ai des dents mais je ne mords pas. Qu'est-ce que je suis ?",
        answer: 'peigne',
        type: 'DEVINETTE',
      },
      {
        text: "Je cours mais je n'ai pas de jambes. Qu'est-ce que je suis ?",
        answer: 'eau|riviere',
        type: 'DEVINETTE',
      },
      {
        text: "Plus on m'enlève, plus je deviens grande. Qu'est-ce que je suis ?",
        answer: 'trou',
        type: 'DEVINETTE',
      },
      {
        text: "J'ai une tête et une queue mais pas de corps. Qu'est-ce que je suis ?",
        answer: 'piece|monnaie',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis toujours devant toi mais tu ne peux jamais me toucher. Qu'est-ce que je suis ?",
        answer: 'avenir|futur',
        type: 'DEVINETTE',
      },
      {
        text: 'Tout le monde me soulève mais personne ne peut me tenir longtemps.',
        answer: 'souffle',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis rond, je tourne, je guide les voyageurs.',
        answer: 'boussole',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis la fille de l'eau mais si l'eau me touche, je meurs.",
        answer: 'glace',
        type: 'DEVINETTE',
      },
      {
        text: "On me jette pour m'utiliser et on me ramène quand on n'a plus besoin de moi (en mer).",
        answer: 'ancre',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui a un œil mais ne peut pas voir ?",
        answer: 'aiguille',
        type: 'DEVINETTE',
      },
      {
        text: 'Je grandis quand je mange, mais je meurs quand je bois. Qui suis-je ?',
        answer: 'feu',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui t'appartient mais que les autres utilisent plus que toi ?",
        answer: 'nom|prenom',
        type: 'DEVINETTE',
      },
      {
        text: 'Je peux remplir une pièce entière sans prendre de place. Qui suis-je ?',
        answer: 'lumiere',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui tombe sans jamais se faire mal ?",
        answer: 'nuit|pluie',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui monte et qui descend sans jamais bouger ?",
        answer: 'escalier|temperature',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis léger comme une plume, mais même le plus fort des hommes ne peut me retenir plus de quelques minutes.',
        answer: 'souffle|respiration',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis le vêtement traditionnel par excellence au Bénin, souvent très coloré, et porté lors des grandes cérémonies. Qui suis-je ?',
        answer: 'bompa|bomba|kanvo|pagne tisse|pagne|tissu',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis une sauce béninoise rouge à base de tomate, d'oignon et d'huile, souvent pimentée, qui accompagne viandes et poissons. Qui suis-je ?",
        answer: 'dja|sauce dja|friture|friture de tomate',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis un long morceau de bois très lourd utilisé pour piler l'igname dans un mortier. Qui suis-je ?",
        answer: 'pilon',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une place célèbre de Cotonou avec une très grande statue de guerrière. Qui suis-je ?',
        answer: 'place des amazones|amazone',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une très grande place à Cotonou avec un grand symbole communiste et une arme au milieu. Qui suis-je ?',
        answer: "etoile rouge|place de l'etoile rouge",
        type: 'DEVINETTE',
      },
      {
        text: 'On me frappe pour faire de la musique, je suis la base de la percussion traditionnelle béninoise. Qui suis-je ?',
        answer: 'tam-tam|tambour|gon',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une petite boule de pâte de maïs frite, souvent sucrée, vendue au bord des routes au Bénin le matin. Qui suis-je ?',
        answer: 'yovo doko|yovodoko|beignet|beignets',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'ancien nom de la République du Bénin avant 1975. Qui suis-je ?",
        answer: 'dahomey|republique du dahomey',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une moto à trois roues, souvent jaune, de plus en plus utilisée pour le transport de personnes et de marchandises à Cotonou. Qui suis-je ?',
        answer: 'tricycle|keke|tuktuk|tuk-tuk|trois roues',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'université principale et la plus grande du Bénin. Qui suis-je ?",
        answer: "uac|universite d'abomey-calavi",
        type: 'DEVINETTE',
      },
      {
        text: "Je suis le roi d'Abomey le plus célèbre pour avoir farouchement résisté à la pénétration coloniale française. Qui suis-je ?",
        answer: 'behanzin|roi behanzin',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis la langue locale la plus parlée dans le sud du Bénin. Qui suis-je ?',
        answer: 'fon|fongbe',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une rue très animée de Cotonou, réputée pour ses restaurants, maquis et expatriés, souvent appelée le quartier de la joie.',
        answer: 'haie vive',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un insecte nuisible qui vole la nuit, fait du bruit dans les oreilles et donne le paludisme. Qui suis-je ?',
        answer: 'moustique',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une feuille verte très célèbre en Afrique, souvent utilisée pour faire des tisanes guérisseuses miracles. Qui suis-je ?',
        answer: 'moringa|kinkeliba|artemisia',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'acronyme de l'examen final qui marque la fin du collège au Bénin. Qui suis-je ?",
        answer: 'bepc',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis une tenue masculine très ample, souvent richement brodée, portée lors des fêtes en Afrique de l'Ouest. Qui suis-je ?",
        answer: 'agbada|boubou|bomba',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis le repas lourd souvent consommé le dimanche midi par les familles béninoises du nord au sud. Qui suis-je ?',
        answer: 'igname pilee|igname pile|foutou|foutou d\'igname|igname',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis une pâte rapide et facile à préparer, faite avec du gari et de l'eau chaude. Qui suis-je ?",
        answer: 'eba|pate de gari|pate',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis le document que les policiers béninois demandent souvent en premier lors d'un contrôle routier de Zémidjan. Qui suis-je ?",
        answer: 'assurance|piece|carte grise',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'outil métallique chauffé au charbon que les tailleurs ou les mamans utilisent pour repasser quand la SBEE coupe le courant. Qui suis-je ?",
        answer: 'fer a repasser a charbon|fer a charbon',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis la plage la plus fréquentée de Cotonou le week-end, située près de l'aéroport. Qui suis-je ?",
        answer: 'fidjrosse|plage de fidjrosse',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis une poudre blanche ou jaune très fine tirée du manioc, qui gonfle quand on met de l'eau. Qui suis-je ?",
        answer: 'gari',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un petit reptile gris ou coloré qui hoche souvent la tête sur les murs des maisons au Bénin. Qui suis-je ?',
        answer: 'margouillat|lezard',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'expression utilisée pour dire 'bonjour' ou demander 'comment tu t'es réveillé' le matin en langue Fon.",
        answer: 'a fon gan a|afon gan a',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un plat africain à base de riz rouge à la tomate, très contesté sur les réseaux sociaux entre le Nigeria et le Sénégal.',
        answer: 'jollof rice|jollof|riz au gras',
        type: 'DEVINETTE',
      },
      {
        text: "J'ai des branches, mais je n'ai ni feuilles, ni tronc, ni fruits. Qui suis-je ?",
        answer: 'banque|riviere',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui est plein de trous mais retient quand même l'eau ?",
        answer: 'eponge',
        type: 'DEVINETTE',
      },
      {
        text: "Quel est l'animal du désert qui a deux bosses sur le dos ?",
        answer: 'chameau',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis la mère des mois, c'est avec moi que tout recommence. Qui suis-je ?",
        answer: 'janvier',
        type: 'DEVINETTE',
      },
      {
        text: "Je ne fais pas de bruit quand je me lève à l'est, mais j'éclaire tout le monde. Qui suis-je ?",
        answer: 'soleil',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui se trouve à la fin du matin, commence la nuit, et se trouve exactement au milieu de l'année ?",
        answer: 'lettre n|n',
        type: 'DEVINETTE',
      },
      {
        text: "Je peux être de table, de beauté, d'humeur ou de sel. Qui suis-je ?",
        answer: 'grain',
        type: 'DEVINETTE',
      },
      {
        text: "Plus je suis chaud au petit déjeuner, plus on dit que je suis frais. De quoi s'agit-il ?",
        answer: 'pain',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis souvent porté sur la tête des femmes africaines, mais je ne suis pas des cheveux. Qui suis-je ?',
        answer: 'foulard|perruque|gele',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui s'allonge quand on le tire, s'arrondit quand on le lâche, et aide à tenir les habits ?",
        answer: 'elastique|corde|fil|corde a linge',
        type: 'DEVINETTE',
      },
      {
        text: "Je ne respire jamais mais j'ai beaucoup d'air en moi. Si on me perce, je meurs dans un grand bruit. Qui suis-je ?",
        answer: 'ballon',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis très grand quand je suis jeune et petit quand je suis vieux. Je donne de la lumière. Qui suis-je ?',
        answer: 'bougie',
        type: 'DEVINETTE',
      },
      {
        text: "J'ai quatre pieds mais je ne peux pas marcher, j'accompagne souvent un lit ou la salle à manger. Qui suis-je ?",
        answer: 'table|chaise',
        type: 'DEVINETTE',
      },
      {
        text: 'Quel est le comble pour un électricien de la SBEE ? (Trouve la réponse logique)',
        answer: 'ne pas etre au courant',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis un document très cher au Bénin, souvent vert, indispensable pour prendre l'avion et changer de continent. Qui suis-je ?",
        answer: 'passeport',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis la plateforme en ligne française qui donne des sueurs froides aux étudiants béninois désirant voyager. Qui suis-je ?',
        answer: 'campus france|etudes en france',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un site e-commerce asiatique célèbre où les commerçants commandent tout en gros. Qui suis-je ?',
        answer: 'alibaba',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une difficulté dans un jeu de simulation de football (PES) qui fait transpirer et rager les joueurs. Qui suis-je ?',
        answer: 'legende|niveau legende',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis un style de danse très populaire et énergique en Afrique, souvent combiné au hip-hop. Qui suis-je ?',
        answer: 'afro|afrodance|danse africaine',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis une base de données cloud non-relationnelle très appréciée des développeurs. Mon logo est une petite feuille verte. Qui suis-je ?',
        answer: 'mongodb|mongo',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis le stade mythique de Cotonou, souvent le lieu des grands concerts et des grands matchs nationaux. Qui suis-je ?',
        answer: "stade de l'amitie|stade general mathieu kerekou",
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'endroit tentaculaire près du port de Cotonou où s'achètent et se vendent des milliers de voitures d'occasion. Qui suis-je ?",
        answer: 'parc auto|les parcs',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis une application et un site web où l'on trouve énormément d'inspiration visuelle pour la mode, le design et les recettes. Qui suis-je ?",
        answer: 'pinterest',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'outil de design préféré des non-designers pour faire des affiches rapides, même pour promouvoir une 'moyo party'. Qui suis-je ?",
        answer: 'canva',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis le petit groupe de mots au bas d'une affiche professionnelle qui remplace désormais 'sport officiel' pour donner un numéro de téléphone. Qui suis-je ?",
        answer: 'contact officiel',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui a des racines que personne ne voit, qui est plus grand que les arbres, qui monte très haut et qui pourtant ne pousse jamais ?",
        answer: 'montagne',
        type: 'DEVINETTE',
      },
      {
        text: 'Je vole sans ailes dans le ciel et je pleure sans yeux sur la terre. Qui suis-je ?',
        answer: 'nuage',
        type: 'DEVINETTE',
      },
      {
        text: "Qu'est-ce qui t'appartient légitimement, mais que tes amis béninois utilisent toujours plus que toi-même ?",
        answer: 'prenom|nom',
        type: 'DEVINETTE',
      },
      {
        text: "Je peux voyager d'un bout à l'autre du monde tout en restant coincé dans le même coin. Qui suis-je ?",
        answer: 'timbre',
        type: 'DEVINETTE',
      },
      {
        text: 'Je commence au milieu de la nuit et je me termine à la fin du matin. Qui suis-je ?',
        answer: 'lettre n|n',
        type: 'DEVINETTE',
      },
      {
        text: 'Je suis le repas très matinal, souvent bu chaud dans un bol au Bénin, avec un peu de sucre et parfois du lait. Qui suis-je ?',
        answer: 'bouillie|akui|akassa|koko',
        type: 'DEVINETTE',
      },
      {
        text: "Je suis l'imposant pont routier à plusieurs niveaux construit pour soulager les embouteillages vers Abomey-Calavi. Qui suis-je ?",
        answer: 'echangeur|echangeur de godomey',
        type: 'DEVINETTE',
      },
      {
        text: "On m'achète pour manger, on me met sur la table, mais on ne me mange absolument jamais. Qui suis-je ?",
        answer: 'assiette|cuillere',
        type: 'DEVINETTE',
      },
      {
        text: "Je t'accompagne partout, je suis plus intelligent que toi, mais si ma batterie tombe à zéro, tu perds tes moyens. Qui suis-je ?",
        answer: 'smartphone|telephone|portable',
        type: 'DEVINETTE',
      },
      // ─── QUIZ (50 questions) ──────────────────────────────────────────────
      {
        text: "Quelle est la capitale officielle du Bénin ?\n\n1️⃣ Cotonou\n2️⃣ Porto-Novo\n3️⃣ Parakou\n4️⃣ Abomey-Calavi",
        answer: "2|porto-novo|porto novo",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel fleuve traverse l'Afrique et est considéré comme le plus long du monde ?\n\n1️⃣ Le Congo\n2️⃣ Le Niger\n3️⃣ Le Nil\n4️⃣ Le Zambèze",
        answer: "3|le nil|nil",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Qui est l'actuel président du Bénin ?\n\n1️⃣ Boni Yayi\n2️⃣ Patrice Talon\n3️⃣ Nicéphore Soglo\n4️⃣ Mathieu Kérékou",
        answer: "2|patrice talon|talon",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
      {
        text: "Quelle est la langue nationale la plus parlée au Bénin ?\n\n1️⃣ Le Fon\n2️⃣ Le Yoruba\n3️⃣ Le Bariba\n4️⃣ Le Dendi",
        answer: "1|le fon|fon",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Quel roi du Dahomey a dirigé la résistance contre la colonisation française ?\n\n1️⃣ Le Roi Toffa\n2️⃣ Le Roi Béhanzin\n3️⃣ Le Roi Guézo\n4️⃣ Le Roi Agadja",
        answer: "2|le roi behanzin|behanzin",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
      {
        text: "Quel est le plus haut sommet du Bénin ?\n\n1️⃣ Le Mont Sagbado\n2️⃣ Le Mont Sokbaro\n3️⃣ Le Mont Tanéka\n4️⃣ La chaîne de l'Atacora",
        answer: "2|le mont sokbaro|mont sokbaro|sokbaro",
        type: "QUIZ",
        category: "geographie",
        difficulty: "MEDIUM",
      },
      {
        text: "Dans quel département se trouve la célèbre cité lacustre de Ganvié ?\n\n1️⃣ Ouémé\n2️⃣ Atlantique\n3️⃣ Littoral\n4️⃣ Mono",
        answer: "2|atlantique",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel parc national au nord du Bénin est réputé pour sa faune sauvage ?\n\n1️⃣ Le Parc de la Pendjari\n2️⃣ Le Parc du W\n3️⃣ Le Parc de la boucle du Baoulé\n4️⃣ Le Parc national du Niokolo-Koba",
        answer: "1|pendjari|le parc de la pendjari|parc de la pendjari",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel est l'ancien nom de la République du Bénin ?\n\n1️⃣ Dahomey\n2️⃣ Haute-Volta\n3️⃣ Soudan français\n4️⃣ Côte de l'Or",
        answer: "1|dahomey|le dahomey",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
      {
        text: "Quelle ville béninoise est connue pour être le berceau historique du culte vaudou ?\n\n1️⃣ Abomey\n2️⃣ Ouidah\n3️⃣ Kétou\n4️⃣ Savalou",
        answer: "2|ouidah",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Quelle est la monnaie officielle utilisée au Bénin ?\n\n1️⃣ Le Franc Guinéen\n2️⃣ Le Dollar\n3️⃣ Le Franc CFA\n4️⃣ Le Cedi",
        answer: "3|franc cfa|cfa|le franc cfa",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Quel pays est situé directement à l'est du Bénin ?\n\n1️⃣ Le Togo\n2️⃣ Le Niger\n3️⃣ Le Nigeria\n4️⃣ Le Burkina Faso",
        answer: "3|le nigeria|nigeria",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel pays est situé directement à l'ouest du Bénin ?\n\n1️⃣ Le Togo\n2️⃣ Le Ghana\n3️⃣ La Côte d'Ivoire\n4️⃣ Le Nigeria",
        answer: "1|le togo|togo",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quelle fête nationale est célébrée le 10 janvier au Bénin ?\n\n1️⃣ La fête de l'indépendance\n2️⃣ La fête du Travail\n3️⃣ La fête nationale des Religions Traditionnelles (Vaudou)\n4️⃣ La fête de la jeunesse",
        answer: "3|fete du vaudou|fete des religions traditionnelles|vaudou|3",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Quel monument célèbre de Cotonou rend hommage aux femmes combattantes du Dahomey ?\n\n1️⃣ L'Étoile rouge\n2️⃣ Le Monument de l'Amazone\n3️⃣ La Place du Souvenir\n4️⃣ La Place Bulgarie",
        answer: "2|le monument de l'amazone|monument de l'amazone|amazone",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Quel lac borde la ville de Cotonou et de Porto-Novo ?\n\n1️⃣ Le lac Nokoué\n2️⃣ Le lac Ahémé\n3️⃣ Le lac Victoria\n4️⃣ Le lac Tchad",
        answer: "1|le lac nokoue|lac nokoue|nokoue",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel héros national béninois s'est illustré par sa résistance contre les Français au nord du pays ?\n\n1️⃣ Bio Guéra\n2️⃣ Kaba\n3️⃣ Béhanzin\n4️⃣ Kérékou",
        answer: "1|bio guera",
        type: "QUIZ",
        category: "histoire",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle ville béninoise est célèbre pour ses collines rocheuses ?\n\n1️⃣ Savè\n2️⃣ Dassa-Zoumè\n3️⃣ Lokossa\n4️⃣ Parakou",
        answer: "2|dassa-zoume|dassa|dassa zoume|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "MEDIUM",
      },
      {
        text: "Quel groupe ethnique et culturel est originaire du nord-est du Bénin (Nikki) ?\n\n1️⃣ Les Fons\n2️⃣ Les Baribas\n3️⃣ Les Yorubas\n4️⃣ Les Dendis",
        answer: "2|les baribas|bariba|baribas|2",
        type: "QUIZ",
        category: "culture",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle est la date de l'indépendance du Bénin ?\n\n1️⃣ 1er août 1960\n2️⃣ 14 juillet 1960\n3️⃣ 27 avril 1960\n4️⃣ 22 septembre 1960",
        answer: "1|1er aout 1960|1 aout 1960|1er aout|1",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
      {
        text: "Quel est le plus grand marché à ciel ouvert d'Afrique de l'Ouest, situé à Cotonou ?\n\n1️⃣ Marché Dantokpa\n2️⃣ Marché Missèbo\n3️⃣ Marché Gbégamey\n4️⃣ Marché Saint-Michel",
        answer: "1|marche dantokpa|dantokpa|1",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quelle plante produit les amandes utilisées pour fabriquer le beurre corporel très prisé au nord du Bénin ?\n\n1️⃣ Le cacaoyer\n2️⃣ Le palmier à huile\n3️⃣ Le karité\n4️⃣ L'arganier",
        answer: "3|le karite|karite|3",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Quel festival culturel annuel célèbre la royauté bariba à Nikki ?\n\n1️⃣ La Gani\n2️⃣ Le Nonvitcha\n3️⃣ Le Gelede\n4️⃣ La fête de l'igname",
        answer: "1|la gani|gani|1",
        type: "QUIZ",
        category: "culture",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle est la plus grande réserve de biosphère d'Afrique de l'Ouest, partagée entre le Bénin, le Burkina Faso et le Niger ?\n\n1️⃣ Le complexe W-Arly-Pendjari (WAP)\n2️⃣ Le parc national du Serengeti\n3️⃣ Le parc national de Kruger\n4️⃣ Le parc national de la Comoé",
        answer: "1|wap|le complexe w-arly-pendjari|complex wap|1",
        type: "QUIZ",
        category: "geographie",
        difficulty: "HARD",
      },
      {
        text: "Quel écrivain béninois a écrit l'œuvre célèbre 'L'Esclave' en 1956 ?\n\n1️⃣ Florent Couao-Zotti\n2️⃣ Olympe Bhêly-Quenum\n3️⃣ Jean Pliya\n4️⃣ Albert Tévoédjrè",
        answer: "2|olympe bhely-quenum|olympe bhely quenum|2",
        type: "QUIZ",
        category: "culture",
        difficulty: "HARD",
      },
      {
        text: "Quel instrument de musique traditionnel béninois est composé de cloches métalliques ?\n\n1️⃣ Le Gogan\n2️⃣ Le Tambour djembe\n3️⃣ La Kora\n4️⃣ Le Balafon",
        answer: "1|gogan|le gogan|1",
        type: "QUIZ",
        category: "culture",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle est la capitale économique du Bénin ?\n\n1️⃣ Porto-Novo\n2️⃣ Cotonou\n3️⃣ Parakou\n4️⃣ Abomey-Calavi",
        answer: "2|cotonou|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel animal figure sur les armoiries de la République du Bénin ?\n\n1️⃣ L'aigle royal\n2️⃣ Le faucon\n3️⃣ La panthère\n4️⃣ Le léopard",
        answer: "3|panthere|les pantheres|pantheres|3",
        type: "QUIZ",
        category: "culture",
        difficulty: "MEDIUM",
      },
      {
        text: "Dans quelle ville béninoise se trouve la plus ancienne église catholique du pays ?\n\n1️⃣ Cotonou\n2️⃣ Ouidah\n3️⃣ Porto-Novo\n4️⃣ Abomey",
        answer: "2|ouidah|2",
        type: "QUIZ",
        category: "histoire",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle chanson a rendu mondialement célèbre la chanteuse béninoise Angélique Kidjo ?\n\n1️⃣ Malaika\n2️⃣ Agolo\n3️⃣ Wombo Lombo\n4️⃣ Batonga",
        answer: "2|agolo|2",
        type: "QUIZ",
        category: "culture",
        difficulty: "EASY",
      },
      {
        text: "Qui a été le premier président de la République du Dahomey après l'indépendance ?\n\n1️⃣ Hubert Maga\n2️⃣ Sourou-Migan Apithy\n3️⃣ Justin Ahomadégbé\n4️⃣ Émile Derlin Zinsou",
        answer: "1|hubert maga|maga|1",
        type: "QUIZ",
        category: "histoire",
        difficulty: "MEDIUM",
      },
      {
        text: "Dans quel pays d'Afrique se trouvent les célèbres pyramides de Gizeh ?\n\n1️⃣ Le Soudan\n2️⃣ L'Égypte\n3️⃣ Le Maroc\n4️⃣ L'Éthiopie",
        answer: "2|egypte|l'egypte|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel pays africain est le plus peuplé au monde ?\n\n1️⃣ L'Éthiopie\n2️⃣ L'Égypte\n3️⃣ Le Nigeria\n4️⃣ La République Démocratique du Congo",
        answer: "3|nigeria|le nigeria|3",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quelle montagne d'Afrique est la plus haute du continent ?\n\n1️⃣ Le Mont Kenya\n2️⃣ Le Mont Kilimandjaro\n3️⃣ Le Mont Cameroun\n4️⃣ Le Toubkal",
        answer: "2|le mont kilimandjaro|kilimandjaro|mont kilimandjaro|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Dans quelle ville se trouve le siège de l'Union Africaine ?\n\n1️⃣ Addis-Abeba\n2️⃣ Nairobi\n3️⃣ Johannesbourg\n4️⃣ Le Caire",
        answer: "1|addis-abeba|addis abeba|1",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel leader politique a été le premier président noir d'Afrique du Sud en 1994 ?\n\n1️⃣ Desmond Tutu\n2️⃣ Thabo Mbeki\n3️⃣ Nelson Mandela\n4️⃣ F. W. de Klerk",
        answer: "3|nelson mandela|mandela|3",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
      {
        text: "Quel désert, situé au nord de l'Afrique, est le plus grand désert chaud du monde ?\n\n1️⃣ Le désert du Kalahari\n2️⃣ Le désert du Sahara\n3️⃣ Le désert de Namib\n4️⃣ Le désert de Libye",
        answer: "2|le desert du sahara|sahara|desert du sahara|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quelle île africaine est la plus grande du continent et la quatrième plus grande du monde ?\n\n1️⃣ Zanzibar\n2️⃣ Madagascar\n3️⃣ L'île Maurice\n4️⃣ Les Seychelles",
        answer: "2|madagascar|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel pays d'Afrique de l'Est a pour capitale Nairobi ?\n\n1️⃣ L'Ouganda\n2️⃣ La Tanzanie\n3️⃣ Le Kenya\n4️⃣ La Somalie",
        answer: "3|le kenya|kenya|3",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel empire médiéval était dirigé par Mansa Moussa, l'homme considéré comme le plus riche de l'histoire ?\n\n1️⃣ L'Empire du Ghana\n2️⃣ L'Empire du Mali\n3️⃣ L'Empire Songhaï\n4️⃣ Le Royaume du Bénin",
        answer: "2|l'empire du mali|empire du mali|mali|2",
        type: "QUIZ",
        category: "histoire",
        difficulty: "MEDIUM",
      },
      {
        text: "Quel océan borde la côte ouest de l'Afrique ?\n\n1️⃣ L'océan Indien\n2️⃣ L'océan Atlantique\n3️⃣ L'océan Pacifique\n4️⃣ L'océan Arctique",
        answer: "2|l'ocean atlantique|ocean atlantique|atlantique|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quelle cascade spectaculaire, située sur le fleuve Zambèze, est l'une des plus grandes du monde ?\n\n1️⃣ Les chutes de la Lobé\n2️⃣ Les chutes de Kalandula\n3️⃣ Les chutes Victoria\n4️⃣ Les chutes d'Ouzoud",
        answer: "3|les chutes victoria|chutes victoria|victoria|3",
        type: "QUIZ",
        category: "geographie",
        difficulty: "MEDIUM",
      },
      {
        text: "Quel pays africain n'a jamais été formellement colonisé par une puissance européenne ?\n\n1️⃣ L'Éthiopie\n2️⃣ Le Ghana\n3️⃣ Le Sénégal\n4️⃣ Le Zimbabwe",
        answer: "1|l'ethiopie|ethiopie|1",
        type: "QUIZ",
        category: "histoire",
        difficulty: "HARD",
      },
      {
        text: "Quelle grande île historique sénégalaise était un centre de transit majeur de la traite des esclaves ?\n\n1️⃣ L'île de Gorée\n2️⃣ L'île de Saint-Louis\n3️⃣ L'île de Ngor\n4️⃣ L'île de Karabane",
        answer: "1|l'ile de goree|ile de goree|goree|1",
        type: "QUIZ",
        category: "histoire",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle est la capitale de la Côte d'Ivoire ?\n\n1️⃣ Abidjan\n2️⃣ Yamoussoukro\n3️⃣ Bouaké\n4️⃣ San-Pédro",
        answer: "2|yamoussoukro|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel est le plus grand lac d'Afrique par sa superficie ?\n\n1️⃣ Le lac Tanganyika\n2️⃣ Le lac Victoria\n3️⃣ Le lac Malawi\n4️⃣ Le lac Tchad",
        answer: "2|le lac victoria|lac victoria|victoria|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel pays est surnommé 'Le pays des mille collines' ?\n\n1️⃣ Le Burundi\n2️⃣ Le Rwanda\n3️⃣ L'Éthiopie\n4️⃣ Le Lesotho",
        answer: "2|le rwanda|rwanda|2",
        type: "QUIZ",
        category: "geographie",
        difficulty: "MEDIUM",
      },
      {
        text: "Quelle plante d'Afrique du Nord était utilisée par les anciens Égyptiens pour fabriquer du papier ?\n\n1️⃣ Le lotus\n2️⃣ Le papyrus\n3️⃣ Le palmier\n4️⃣ Le roseau",
        answer: "2|le papyrus|papyrus|2",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
      {
        text: "Quelle est la capitale du Togo voisin ?\n\n1️⃣ Lomé\n2️⃣ Kara\n3️⃣ Sokodé\n4️⃣ Aného",
        answer: "1|lome|1",
        type: "QUIZ",
        category: "geographie",
        difficulty: "EASY",
      },
      {
        text: "Quel monument historique de la ville de Ouidah symbolise le point de départ forcé des esclaves vers les Amériques ?\n\n1️⃣ La Porte du Non-Retour\n2️⃣ La Place Chacha\n3️⃣ Le Fort Portugais\n4️⃣ La forêt sacrée de Kpassè",
        answer: "1|la porte du non-retour|la porte du non retour|porte du non-retour|porte du non retour|1",
        type: "QUIZ",
        category: "histoire",
        difficulty: "EASY",
      },
    ],
  });

  const count = await prisma.question.count();
  console.log(`✅ ${count} questions insérées avec succès !`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
