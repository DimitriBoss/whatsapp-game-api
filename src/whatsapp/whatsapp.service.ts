import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { GameService } from '../game/game.service';
import { BotState, QuestionType } from '@prisma/client';

@Injectable()
export class WhatsappService implements OnModuleInit {
  constructor(private gameService: GameService) {}
  private client: Client;

  // Cette méthode s'exécute automatiquement au lancement de NestJS
  onModuleInit() {
    this.initializeClient();
  }

  private initializeClient() {
    // On initialise le client avec LocalAuth pour sauvegarder la session
    // Ça évite de devoir rescanner le QR code à chaque redémarrage du serveur
    this.client = new Client({
      authStrategy: new LocalAuth(),
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1041881976-alpha.html',
      },
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    });

    // 1. Générer le QR Code dans le terminal
    this.client.on('qr', (qr) => {
      console.log('📱 Scanne ce QR Code avec ton WhatsApp pour lier le bot :');
      qrcode.generate(qr, { small: true });
      console.log('🔗 Ou clique sur ce lien si le QR Code ci-dessus est déformé :');
      console.log(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`);
    });

    // 2. Confirmer la connexion
    this.client.on('ready', () => {
      console.log('✅ Bot WhatsApp connecté avec succès !');
    });

    // Gestion des erreurs d'authentification ou déconnexions
    this.client.on('auth_failure', (message) => {
      console.error('❌ Échec de l\'authentification :', message);
    });

    this.client.on('disconnected', (reason) => {
      console.error('❌ Le client WhatsApp a été déconnecté :', reason);
    });

    // 3. Écouter les messages entrants
    this.client.on('message', async (msg) => {
      try {
        // Récupère ou crée l'utilisateur à chaque message
      const user = await this.gameService.getOrCreateUser(msg.from);
      const text = msg.body.trim().toLowerCase(); // majuscule ou minuscule = pareil

      // 🛑 Commande d'arrêt — disponible depuis n'importe quel état
      if (text === '/stop' || text === '/close') {
        await this.gameService.updateUserState(msg.from, BotState.STOPPED);
        await this.gameService.updateGameSession(msg.from, null, 0);
        await msg.reply(
          "🛑 Le bot a été arrêté et mis en veille. Il n'enverra plus aucun message.\nPour recommencer à jouer, envoie */start* ou */restart*.",
        );
        return;
      }

      // 🔄 Commande de reset / start — disponible depuis n'importe quel état (y compris STOPPED)
      if (text === '/reset' || text === '/start' || text === '/restart') {
        await this.gameService.updateGameSession(msg.from, null, 0);
        if (user.firstName) {
          await this.gameService.updateUserState(msg.from, BotState.MAIN_MENU);
          await msg.reply(
            `🎉 Bonjour à nouveau *${user.firstName}* ! Choisis un jeu :\n\n` +
              `1️⃣ - Action / Vérité\n\n` +
              `2️⃣ - Devinette\n\n` +
              `Réponds avec *1* ou *2*\n\n` +
              `💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._`,
          );
        } else {
          await this.gameService.updateUserState(msg.from, BotState.AWAITING_NAME);
          await msg.reply(
            "👋 Bienvenue sur *GameBot* !\nComment tu t'appelles ? (Envoie ton prénom)\n\n" +
              "💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._",
          );
        }
        return;
      }

      // 🤫 Si le bot est en veille (STOPPED), on ignore complètement tous les autres messages
      if (user.botState === BotState.STOPPED) {
        return;
      }

      switch (user.botState) {
        // 1️⃣ Premier contact → demande le prénom
        case 'START':
          await this.gameService.updateUserState(
            msg.from,
            BotState.AWAITING_NAME,
          );
          await msg.reply(
            "👋 Bienvenue sur *GameBot* !\nComment tu t'appelles ? (Envoie ton prénom)\n\n" +
              "💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._",
          );
          break;

        // 2️⃣ On reçoit le prénom → affiche le menu principal
        case 'AWAITING_NAME':
          // On utilise msg.body.trim() et non "text" pour garder la casse originale du prénom
          const firstName = msg.body.trim();
          await this.gameService.setUserFirstName(msg.from, firstName);
          await this.gameService.updateUserState(msg.from, BotState.MAIN_MENU);
          await msg.reply(
            `🎉 Bonjour *${firstName}* ! Choisis un jeu :\n\n` +
              `1️⃣ - Action / Vérité\n\n` +
              `2️⃣ - Devinette\n\n` +
              `Réponds avec *1* ou *2*\n\n` +
              `💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._`,
          );
          break;

        // 3️⃣ Menu principal → redirige vers le bon mode
        case 'MAIN_MENU':
          if (text === '1') {
            await this.gameService.updateUserState(
              msg.from,
              BotState.PLAYING_ACTION_VERITE,
            );
            await msg.reply(
              `🎭 *ACTION OU VÉRITÉ* 💬\n\n` +
                `1️⃣ ou */action* - Recevoir une Action\n\n` +
                `2️⃣ ou */verite* - Recevoir une Vérité\n\n` +
                `0️⃣ ou */retour* - Retourner au menu principal`,
            );
          } else if (text === '2') {
            await this.gameService.updateUserState(
              msg.from,
              BotState.PLAYING_DEVINETTE,
            );
            const devinette = await this.gameService.getRandomQuestion(
              msg.from,
              QuestionType.DEVINETTE,
            );
            if (!devinette) {
              await msg.reply(
                "😅 Aucune devinette disponible pour l'instant !",
              );
            } else {
              await this.gameService.updateGameSession(
                msg.from,
                devinette.id,
                0,
              );
              await msg.reply(
                `🧩 *DEVINETTE*\n\n${devinette.text}\n\n_(Réponds à la devinette, ou tape *suivant* pour passer, *0* pour le menu)_`,
              );
            }
          } else {
            await msg.reply(
              `❓ Choisis :\n\n1️⃣ - Action / Vérité\n\n2️⃣ - Devinette\n\n` +
                `💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._`,
            );
          }
          break;

        // 4️⃣ Mode Action/Vérité → nouvelle question ou retour menu
        case 'PLAYING_ACTION_VERITE':
          if (text === '0' || text === '/retour') {
            await this.gameService.updateUserState(
              msg.from,
              BotState.MAIN_MENU,
            );
            await msg.reply(
              `🏠 Menu :\n\n1️⃣ - Action / Vérité\n\n2️⃣ - Devinette`,
            );
          } else if (text === '1' || text === '/action') {
            const question = await this.gameService.getRandomQuestion(
              msg.from,
              QuestionType.ACTION,
            );
            if (!question) {
              await msg.reply("😅 Plus d'actions disponibles !");
            } else {
              await msg.reply(
                `🎭 *ACTION*\n\n${question.text}\n\n` +
                  `_(Envoie *1* ou */action* pour une autre action, *2* ou */verite* pour une vérité, *0* ou */retour* pour le menu)_`,
              );
            }
          } else if (text === '2' || text === '/verite' || text === '/vérité') {
            const question = await this.gameService.getRandomQuestion(
              msg.from,
              QuestionType.VERITE,
            );
            if (!question) {
              await msg.reply('😅 Plus de vérités disponibles !');
            } else {
              await msg.reply(
                `💬 *VÉRITÉ*\n\n${question.text}\n\n` +
                  `_(Envoie *1* ou */action* pour une action, *2* ou */verite* pour une autre vérité, *0* ou */retour* pour le menu)_`,
              );
            }
          }
          // Tout autre message → silence
          break;

        // 5️⃣ Mode Devinette → nouvelle devinette ou retour menu
        case 'PLAYING_DEVINETTE':
          if (text === '0' || text === '/retour') {
            await this.gameService.updateGameSession(msg.from, null, 0);
            await this.gameService.updateUserState(
              msg.from,
              BotState.MAIN_MENU,
            );
            await msg.reply(
              `🏠 Menu :\n\n1️⃣ - Action / Vérité\n\n2️⃣ - Devinette`,
            );
          } else if (text === 'suivant') {
            const devinette = await this.gameService.getRandomQuestion(
              msg.from,
              QuestionType.DEVINETTE,
            );
            if (!devinette) {
              await msg.reply('😅 Plus de devinettes disponibles !');
            } else {
              await this.gameService.updateGameSession(
                msg.from,
                devinette.id,
                0,
              );
              await msg.reply(
                `🧩 *DEVINETTE*\n\n${devinette.text}\n\n_(Réponds à la devinette, ou tape *suivant* pour passer, *0* pour le menu)_`,
              );
            }
          } else {
            // Tentative de réponse
            const session = await this.gameService.getGameSession(msg.from);
            if (!session || !session.currentQuestionId) {
              await msg.reply(
                "🧩 Tu n'as pas de devinette active en ce moment.\nEnvoie *suivant* pour en obtenir une nouvelle, ou *0* pour le menu.",
              );
            } else {
              const question = await this.gameService.getQuestionById(
                session.currentQuestionId,
              );
              if (!question || !question.answer) {
                await this.gameService.updateGameSession(msg.from, null, 0);
                await msg.reply(
                  "🧩 Cette devinette n'a pas de réponse configurée. Envoie *suivant* pour passer à la suivante.",
                );
              } else {
                const normalizedUserAnswer = this.normalizeText(msg.body);
                const isCorrect = question.answer
                  .split('|')
                  .some((option) =>
                    normalizedUserAnswer.includes(this.normalizeText(option)),
                  );

                if (isCorrect) {
                  await this.gameService.updateGameSession(msg.from, null, 0);
                  const firstAnswer = question.answer.split('|')[0];
                  await msg.reply(
                    `🎉 *Félicitations !* C'est la bonne réponse ! 🥳\n` +
                      `La réponse était bien : *${firstAnswer}*\n\n` +
                      `_(Envoie *suivant* pour une autre devinette, ou *0* pour le menu)_`,
                  );
                } else {
                  const newAttempts = session.attempts + 1;
                  if (newAttempts < 3) {
                    await this.gameService.updateGameSession(
                      msg.from,
                      question.id,
                      newAttempts,
                    );
                    const remaining = 3 - newAttempts;
                    await msg.reply(
                      `❌ *Mauvaise réponse !*\n` +
                        `Il te reste *${remaining}* tentative${remaining > 1 ? 's' : ''}. Réessaie :`,
                    );
                  } else {
                    await this.gameService.updateGameSession(msg.from, null, 0);
                    const firstAnswer = question.answer.split('|')[0];
                    await msg.reply(
                      `❌ *Dommage !* C'était ta dernière tentative.\n` +
                        `💡 La bonne réponse était : *${firstAnswer}*.\n\n` +
                        `_(Envoie *suivant* pour une autre devinette, ou *0* pour le menu)_`,
                    );
                  }
                }
              }
            }
          }
          break;
      }
      } catch (error) {
        console.error('❌ Erreur lors du traitement du message :', error);
        try {
          await msg.reply(
            "⚠️ Une erreur temporaire est survenue lors du traitement de ta demande. Réessaie dans un instant.",
          );
        } catch (replyError) {
          console.error(
            '❌ Impossible d\'envoyer le message de défaillance :',
            replyError,
          );
        }
      }
    });

    // On lance la machine
    this.client.initialize();
  }

  private normalizeText(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .replace(/[^a-z0-9]/g, '') // ne garde que l'alphanumérique
      .trim();
  }
}
