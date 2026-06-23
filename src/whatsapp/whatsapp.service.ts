import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { GameService } from '../game/game.service';
import { BotState, QuestionType, Severity, UserRole } from '@prisma/client';
import { PenduService } from '../games/pendu/pendu.service';
import { MorpionService } from '../games/morpion/morpion.service';
import { QuizService } from '../games/quiz/quiz.service';
import { EmojiService } from '../games/emoji/emoji.service';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { ErrorLogService } from '../common/services/error-log.service';
import { AdminService } from '../admin/admin.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private client: Client;
  private currentQr: string | null = null;
  private connectedAt: Date | null = null;

  constructor(
    private gameService: GameService,
    private prisma: PrismaService,
    private penduService: PenduService,
    private morpionService: MorpionService,
    private quizService: QuizService,
    private emojiService: EmojiService,
    private rateLimitGuard: RateLimitGuard,
    private errorLogService: ErrorLogService,
    private adminService: AdminService,
  ) {}

  onModuleInit() {
    this.initializeClient();
  }

  getCurrentQr(): string | null {
    return this.currentQr;
  }

  getConnectedAt(): Date | null {
    return this.connectedAt;
  }

  private initializeClient() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      webVersionCache: {
        type: 'remote',
        remotePath:
          'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1041881976-alpha.html',
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
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        ],
      },
    });

    this.client.on('qr', (qr) => {
      this.currentQr = qr;
      this.logger.log('📱 Scanne ce QR Code avec ton WhatsApp pour lier le bot :');
      qrcode.generate(qr, { small: true });
      this.logger.log(
        `🔗 Ou clique sur ce lien si le QR Code est déformé : https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qr)}`,
      );
    });

    this.client.on('ready', () => {
      this.logger.log('✅ Bot WhatsApp connecté avec succès !');
      this.connectedAt = new Date();
    });

    this.client.on('auth_failure', (message) => {
      this.errorLogService.logError(
        'whatsapp.service.auth_failure',
        `Échec de l'authentification : ${message}`,
        Severity.CRITICAL,
      );
    });

    this.client.on('disconnected', (reason) => {
      this.errorLogService.logError(
        'whatsapp.service.disconnected',
        `Le client WhatsApp a été déconnecté : ${reason}`,
        Severity.HIGH,
      );
    });

    this.client.on('message', async (msg) => {
      try {
        const isGroup = msg.from.endsWith('@g.us');
        const senderNumber = isGroup ? msg.author : msg.from;

        if (!senderNumber) return; // Ignorer les messages systèmes de groupe

        // Clé de session composite en cas de groupe
        const sessionKey = isGroup ? `${msg.from}:${senderNumber}` : msg.from;

        // 1. Rate Limiting Check
        if (this.rateLimitGuard.isRateLimited(sessionKey)) {
          await msg.reply('⏳ Tu envoies trop de messages, attends un peu.');
          return;
        }

        // 2. Récupérer ou créer l'utilisateur
        const user = await this.gameService.getOrCreateUser(senderNumber);

        // 3. Vérifier si l'utilisateur est bloqué
        if (user.isBlocked) {
          return; // On l'ignore silencieusement
        }

        const text = msg.body.trim().toLowerCase();
        const TIP = `\n\n💡 _Astuce : À tout moment, envoie */stop* pour mettre le bot en pause, ou */start* pour le relancer._`;

        // 🛑 Commande d'arrêt globale
        if (text === '/stop' || text === '/close') {
          await this.gameService.updateUserState(senderNumber, BotState.STOPPED);
          await this.gameService.updateGameSessionWithData(sessionKey, null, null);
          await msg.reply(
            `🛑 Le bot a été arrêté et mis en veille. Il n'enverra plus aucun message.\nPour recommencer à jouer, envoie */start* ou */restart*.`,
          );
          return;
        }

        // 🔄 Commande de démarrage/relance globale
        if (text === '/reset' || text === '/start' || text === '/restart') {
          await this.gameService.updateGameSessionWithData(sessionKey, null, null);
          if (user.firstName) {
            await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
            await msg.reply(await this.getMainMenuMessage(user.firstName, TIP));
          } else {
            await this.gameService.updateUserState(senderNumber, BotState.AWAITING_NAME);
            await msg.reply(
              `👋 Bienvenue sur *GameBot* !\nComment tu t'appelles ? (Envoie ton prénom)${TIP}`,
            );
          }
          return;
        }

        // Commande globale d'aide
        if (text === '/help' || text === '/aide') {
          await msg.reply(this.getHelpMessage() + TIP);
          return;
        }

        // Commande globale de ping
        if (text === '/ping') {
          await msg.reply('🏓 Pong ! Le bot est en ligne.');
          return;
        }

        // Commandes admin WhatsApp (commencent par #)
        if (msg.body.startsWith('#')) {
          await this.handleAdminCommand(msg, senderNumber);
          return;
        }

        // Si le bot est arrêté (STOPPED), on ignore le reste
        if (user.botState === BotState.STOPPED) {
          return;
        }

        // Gestion de l'anti-bruit en groupe : ignorer les messages non interactifs si le bot n'est pas en cours de jeu
        if (isGroup) {
          const isCommand = msg.body.startsWith('/');
          const isMenuOption =
            user.botState === BotState.MAIN_MENU && ['1', '2', '3', '4', '5', '6', '0'].includes(text);
          const isQuizOption = user.botState === BotState.PLAYING_QUIZ;
          const isPenduOption = user.botState === BotState.PLAYING_PENDU;
          const isMorpionOption = user.botState === BotState.PLAYING_MORPION;
          const isEmojiOption = user.botState === BotState.PLAYING_EMOJI;
          const isDevinetteOption = user.botState === BotState.PLAYING_DEVINETTE;
          const isActionVeriteOption = user.botState === BotState.PLAYING_ACTION_VERITE;
          const isNameAwaiting = user.botState === BotState.AWAITING_NAME;

          const isAction =
            isCommand ||
            isMenuOption ||
            isQuizOption ||
            isPenduOption ||
            isMorpionOption ||
            isEmojiOption ||
            isDevinetteOption ||
            isActionVeriteOption ||
            isNameAwaiting;

          if (!isAction) {
            return; // Ignorer les discussions ordinaires du groupe
          }
        }

        // ⚔️ Morpion : Interception du défi direct dans le groupe
        if (isGroup && (text.startsWith('/morpion') || text.startsWith('#morpion'))) {
          if (msg.mentionedIds && msg.mentionedIds.length > 0) {
            const targetId = msg.mentionedIds[0];
            if (targetId === senderNumber) {
              await msg.reply(`⚠️ Tu ne peux pas te défier toi-même au Morpion !`);
              return;
            }

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const game = await this.prisma.morpionGame.create({
              data: {
                inviteCode: code,
                player1ChatId: senderNumber,
                player2ChatId: targetId,
                status: 'PLAYING',
                board: '         ',
              },
            });

            // Associer les sessions dans ce groupe pour les deux joueurs
            const p1SessionKey = `${msg.from}:${senderNumber}`;
            const p2SessionKey = `${msg.from}:${targetId}`;

            await this.gameService.updateUserState(senderNumber, BotState.PLAYING_MORPION);
            await this.gameService.updateGameSessionWithData(p1SessionKey, 'morpion', {
              mode: 'multi',
              gameId: game.id,
              role: 'player1',
              groupChatId: msg.from,
            });

            await this.gameService.updateUserState(targetId, BotState.PLAYING_MORPION);
            await this.gameService.updateGameSessionWithData(p2SessionKey, 'morpion', {
              mode: 'multi',
              gameId: game.id,
              role: 'player2',
              groupChatId: msg.from,
            });

            const rendered = this.morpionService.renderBoard('         ');
            await this.client.sendMessage(
              msg.from,
              `🎮 *MORPION MULTIJOUEUR EN GROUPE* 🎮\n\n` +
                `Partie commencée entre @${senderNumber.split('@')[0]} (❌) et @${targetId.split('@')[0]} (⭕) !\n` +
                `👉 C'est à @${senderNumber.split('@')[0]} de commencer.\n` +
                `Joue en envoyant le numéro d'une case libre (1 à 9).\n\n` +
                `${rendered}`,
              { mentions: [senderNumber, targetId] },
            );
            return;
          }
        }

        // Machine à états principale du bot
        const session = await this.gameService.getGameSession(sessionKey);
        const formLink =
          'https://docs.google.com/forms/d/e/1FAIpQLScBKWZbglMZuXABR4r0QE3nbe4E5CFvVk-F_F-DwZaktS0nZg/viewform?usp=dialog';
        const getFeedbackSuffix = (total: number) => {
          if (total === 20 || total === 50 || total === 100) {
            return `\n\n📝 *Votre avis nous intéresse !* Vous avez joué à ${total} questions. Merci de prendre 1 minute pour remplir ce formulaire de feedback : ${formLink}`;
          }
          return '';
        };

        switch (user.botState) {
          case BotState.START:
            await this.gameService.updateUserState(senderNumber, BotState.AWAITING_NAME);
            await msg.reply(
              `👋 Bienvenue sur *GameBot* !\nComment tu t'appelles ? (Envoie ton prénom)${TIP}`,
            );
            break;

          case BotState.AWAITING_NAME:
            const name = msg.body.trim();
            await this.gameService.setUserFirstName(senderNumber, name);
            await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
            await msg.reply(await this.getMainMenuMessage(name, TIP));
            break;

          case BotState.MAIN_MENU:
            if (text === '1') {
              await this.gameService.updateUserState(senderNumber, BotState.PLAYING_ACTION_VERITE);
              await msg.reply(
                `🎭 *ACTION OU VÉRITÉ* 💬\n\n` +
                  `1️⃣ ou */action* - Recevoir une Action\n\n` +
                  `2️⃣ ou */verite* - Recevoir une Vérité\n\n` +
                  `0️⃣ ou */retour* - Retourner au menu principal${TIP}`,
              );
            } else if (text === '2') {
              await this.gameService.updateUserState(senderNumber, BotState.PLAYING_DEVINETTE);
              const question = await this.gameService.getRandomQuestion(sessionKey, QuestionType.DEVINETTE);
              if (!question) {
                await msg.reply(`😅 Aucune devinette disponible pour l'instant !`);
              } else {
                await this.gameService.updateGameSession(sessionKey, question.id, 0);
                const totalPlayed = await this.gameService.incrementUserQuestionCount(senderNumber, QuestionType.DEVINETTE);
                await msg.reply(
                  `🧩 *DEVINETTE*\n\n${question.text}\n\n` +
                    `_(Réponds à la devinette, ou tape *suivant* pour passer, *0* pour le menu)_` +
                    TIP +
                    getFeedbackSuffix(totalPlayed),
                );
              }
            } else if (text === '3') {
              await this.gameService.updateUserState(senderNumber, BotState.PLAYING_PENDU);
              const welcome = await this.penduService.startGame(sessionKey);
              await msg.reply(welcome + TIP);
            } else if (text === '4') {
              await this.gameService.updateUserState(senderNumber, BotState.PLAYING_MORPION);
              await msg.reply(
                `❌ *JEU DU MORPION* ⭕\n\n` +
                  `Choisis ton mode de jeu :\n` +
                  `1️⃣ - Mode Solo (Imbattable)\n` +
                  `2️⃣ - Mode Solo (Facile)\n` +
                  `3️⃣ - Créer une partie Multijoueur\n` +
                  `4️⃣ - Rejoindre une partie Multijoueur\n` +
                  `0️⃣ - Retour au menu principal\n\n` +
                  `Réponds avec *1*, *2*, *3*, *4* ou *0*.` +
                  (isGroup ? `\n\n👥 _(En groupe, tu peux aussi défier directement un ami en tapant /morpion @mention)_` : '') +
                  TIP,
              );
            } else if (text === '5') {
              await this.gameService.updateUserState(senderNumber, BotState.PLAYING_QUIZ);
              const quizWelcome = await this.quizService.startQuiz(sessionKey);
              await msg.reply(quizWelcome);
            } else if (text === '6') {
              await this.gameService.updateUserState(senderNumber, BotState.PLAYING_EMOJI);
              const emojiWelcome = await this.emojiService.startGame(sessionKey);
              await msg.reply(emojiWelcome + TIP);
            } else if (text === '0') {
              await msg.reply(this.getHelpMessage() + TIP);
            } else {
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            }
            break;

          case BotState.PLAYING_ACTION_VERITE:
            if (text === '0' || text === '/retour' || text === '/menu') {
              await this.gameService.updateGameSessionWithData(sessionKey, null, null);
              await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            } else if (text === '1' || text === '/action') {
              const question = await this.gameService.getRandomQuestion(sessionKey, QuestionType.ACTION);
              if (!question) {
                await msg.reply(`😅 Plus d'actions disponibles !`);
              } else {
                const totalPlayed = await this.gameService.incrementUserQuestionCount(senderNumber, QuestionType.ACTION);
                await this.gameService.updateGameSession(sessionKey, question.id, 0);
                await msg.reply(
                  `🎭 *ACTION*\n\n${question.text}\n\n` +
                    `_(Fais l'action, puis envoie *ok* quand c'est fait. Je ne peux pas vérifier si elle a été faite, mais je recevrai ton message.)_` +
                    TIP +
                    getFeedbackSuffix(totalPlayed),
                );
              }
            } else if (text === '2' || text === '/verite' || text === '/vérité') {
              const question = await this.gameService.getRandomQuestion(sessionKey, QuestionType.VERITE);
              if (!question) {
                await msg.reply(`😅 Plus de vérités disponibles !`);
              } else {
                const totalPlayed = await this.gameService.incrementUserQuestionCount(senderNumber, QuestionType.VERITE);
                await this.gameService.updateGameSession(sessionKey, question.id, 0);
                await msg.reply(
                  `💬 *VÉRITÉ*\n\n${question.text}\n\n` +
                    `_(Réponds directement à cette vérité dans le chat. Je confirmerai la réception de ta réponse.)_` +
                    TIP +
                    getFeedbackSuffix(totalPlayed),
                );
              }
            } else {
              const currentQ = session?.currentQuestionId
                ? await this.gameService.getQuestionById(session.currentQuestionId)
                : null;

              if (currentQ?.type === QuestionType.ACTION) {
                const normalizedText = this.normalizeText(text);
                const confWords = ['ok', 'fait', 'fini', 'termine', 'terminé', 'oui', 'done'];
                const isConfirmation = confWords.some((word) => normalizedText.includes(word));

                if (isConfirmation) {
                  await this.gameService.updateGameSession(sessionKey, null, 0);
                  await msg.reply(
                    `👍 Ok, réceptionné ! Je ne peux pas vérifier si l'action a été faite, mais ton message est bien reçu.\n\n` +
                      `Pour continuer : envoie *1* ou */action* pour une action, *2* ou */verite* pour une vérité, ou *0* pour le menu.`,
                  );
                } else {
                  await msg.reply(
                    `🔔 Envoie *ok* quand l'action est faite. Si tu veux une autre action, envoie *1* ou */action*. Si tu veux une vérité, envoie *2* ou */verite*.`,
                  );
                }
              } else if (currentQ?.type === QuestionType.VERITE) {
                await this.gameService.updateGameSession(sessionKey, null, 0);
                await msg.reply(
                  `✅ Réponse reçue ! Je ne peux pas vérifier si elle est vraie, mais ton message a bien été pris en compte.\n\n` +
                    `Pour continuer : envoie *1* ou */action* pour une action, *2* ou */verite* pour une autre vérité, ou *0* pour le menu.`,
                );
              } else {
                await msg.reply(
                  `📌 Je ne comprends pas ce message. Pour continuer :\n` +
                    `• *1* ou */action* pour une action\n` +
                    `• *2* ou */verite* pour une vérité\n` +
                    `• *0* ou */retour* pour le menu`,
                );
              }
            }
            break;

          case BotState.PLAYING_DEVINETTE:
            if (text === '0' || text === '/retour' || text === '/menu') {
              await this.gameService.updateGameSession(sessionKey, null, 0);
              await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            } else if (text === 'suivant') {
              const devinette = await this.gameService.getRandomQuestion(sessionKey, QuestionType.DEVINETTE);
              if (!devinette) {
                await msg.reply(`😅 Plus de devinettes disponibles !`);
              } else {
                await this.gameService.updateGameSession(sessionKey, devinette.id, 0);
                const totalPlayed = await this.gameService.incrementUserQuestionCount(senderNumber, QuestionType.DEVINETTE);
                await msg.reply(
                  `🧩 *DEVINETTE*\n\n${devinette.text}\n\n` +
                    `_(Réponds à la devinette, ou tape *suivant* pour passer, *0* pour le menu)_` +
                    TIP +
                    getFeedbackSuffix(totalPlayed),
                );
              }
            } else {
              if (!session || !session.currentQuestionId) {
                await msg.reply(`🧩 Tu n'as pas de devinette active. Envoie *suivant* pour en obtenir une.`);
              } else {
                const question = await this.gameService.getQuestionById(session.currentQuestionId);
                if (!question || !question.answer) {
                  await this.gameService.updateGameSession(sessionKey, null, 0);
                  await msg.reply(`🧩 Erreur de configuration de la devinette. Envoie *suivant* pour passer.`);
                } else {
                  const normalizedUserAnswer = this.normalizeText(msg.body);
                  const isCorrect = question.answer
                    .split('|')
                    .some((option) => normalizedUserAnswer.includes(this.normalizeText(option)));

                  if (isCorrect) {
                    await this.gameService.updateGameSession(sessionKey, null, 0);
                    const firstAnswer = question.answer.split('|')[0];
                    await msg.reply(
                      `🎉 *Félicitations !* C'est la bonne réponse ! 🥳\n` +
                        `La réponse était bien : *${firstAnswer}*\n\n` +
                        `_(Envoie *suivant* pour une autre devinette, ou *0* pour le menu)_` +
                        TIP,
                    );
                  } else {
                    const newAttempts = session.attempts + 1;
                    if (newAttempts < 3) {
                      await this.gameService.updateGameSession(sessionKey, question.id, newAttempts);
                      const remaining = 3 - newAttempts;
                      await msg.reply(
                        `❌ *Mauvaise réponse !*\n` +
                          `Il te reste *${remaining}* tentative${remaining > 1 ? 's' : ''}. Réessaie :` +
                          TIP,
                      );
                    } else {
                      await this.gameService.updateGameSession(sessionKey, null, 0);
                      const firstAnswer = question.answer.split('|')[0];
                      await msg.reply(
                        `❌ *Dommage !* C'était ta dernière tentative.\n` +
                          `💡 La bonne réponse était : *${firstAnswer}*.\n\n` +
                          `_(Envoie *suivant* pour une autre devinette, ou *0* pour le menu)_` +
                          TIP,
                      );
                    }
                  }
                }
              }
            }
            break;

          case BotState.PLAYING_PENDU:
            if (text === '0' || text === '/retour' || text === '/menu') {
              await this.gameService.updateGameSessionWithData(sessionKey, null, null);
              await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            } else {
              const response = await this.penduService.handleGuess(sessionKey, msg.body, session?.gameData);
              await msg.reply(response);
            }
            break;

          case BotState.PLAYING_QUIZ:
            if (text === '0' || text === '/retour' || text === '/menu') {
              await this.gameService.updateGameSessionWithData(sessionKey, null, null);
              await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            } else {
              const response = await this.quizService.handleAnswer(sessionKey, msg.body, session?.gameData);
              await msg.reply(response);
            }
            break;

          case BotState.PLAYING_EMOJI:
            if (text === '0' || text === '/retour' || text === '/menu') {
              await this.gameService.updateGameSessionWithData(sessionKey, null, null);
              await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            } else {
              const response = await this.emojiService.handleGuess(sessionKey, msg.body, session?.gameData);
              await msg.reply(response);
            }
            break;

          case BotState.PLAYING_MORPION:
            const gameData = session?.gameData as any;
            if (text === '0' || text === '/retour' || text === '/menu') {
              await this.gameService.updateGameSessionWithData(sessionKey, null, null);
              await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
              await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
            } else if (!gameData || !gameData.mode) {
              // Menu Morpion
              if (text === '1') {
                const response = await this.morpionService.startSoloGame(sessionKey, 'HARD');
                await msg.reply(response);
              } else if (text === '2') {
                const response = await this.morpionService.startSoloGame(sessionKey, 'EASY');
                await msg.reply(response);
              } else if (text === '3') {
                const result = await this.morpionService.createMultiplayerGame(senderNumber);
                const game = await this.prisma.morpionGame.findUnique({ where: { inviteCode: result.code } });
                await this.gameService.updateGameSessionWithData(sessionKey, 'morpion', {
                  mode: 'multi',
                  gameId: game?.id,
                  role: 'player1',
                });
                await msg.reply(result.message);
              } else if (text === '4') {
                await this.gameService.updateGameSessionWithData(sessionKey, 'morpion', {
                  mode: 'awaiting_code',
                });
                await msg.reply(
                  `🔑 *REJOINDRE PARTIE MORPION*\n\nSaisis le code d'invitation à 6 caractères pour rejoindre la partie :${TIP}`,
                );
              } else if (text === '0') {
                await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
                await msg.reply(await this.getMainMenuMessage(user.firstName || 'Ami', TIP));
              } else {
                await msg.reply(
                  `⚠️ Mode invalide. Choisis :\n` +
                    `1 - Solo (Difficile)\n` +
                    `2 - Solo (Facile)\n` +
                    `3 - Créer Multi\n` +
                    `4 - Rejoindre Multi\n` +
                    `0 - Retour au menu`,
                );
              }
            } else if (gameData.mode === 'awaiting_code') {
              const result = await this.morpionService.joinMultiplayerGame(text.toUpperCase(), senderNumber);
              if (!result) {
                await msg.reply(`❌ Code d'invitation invalide.\nSaisis un autre code, ou tape *0* pour le menu.`);
              } else {
                // Alerter l'hôte
                await this.client.sendMessage(result.game.player1ChatId, result.messagePlayer1);
                // Alerter le joueur actuel
                await msg.reply(result.messagePlayer2);
              }
            } else if (gameData.mode === 'solo') {
              const response = await this.morpionService.handleSoloMove(sessionKey, text, gameData);
              await msg.reply(response);
            } else if (gameData.mode === 'multi') {
              const result = await this.morpionService.handleMultiplayerMove(
                senderNumber,
                text,
                gameData.gameId,
                gameData.role,
              );
              if (!result.success) {
                await msg.reply(result.message);
              } else {
                await msg.reply(result.message);
                if (result.shouldNotifyAdversary && result.adversaryChatId && result.adversaryMessage) {
                  if (gameData.groupChatId) {
                    await this.client.sendMessage(gameData.groupChatId, result.adversaryMessage);
                  } else {
                    await this.client.sendMessage(result.adversaryChatId, result.adversaryMessage);
                  }
                }
              }
            }
            break;
        }
      } catch (error) {
        this.errorLogService.logError('whatsapp.service.message_handler', error, Severity.HIGH);
        try {
          await msg.reply(
            `⚠️ Une erreur temporaire est survenue lors du traitement de ta demande. Réessaie dans un instant.`,
          );
        } catch (replyError) {
          this.logger.error("Impossible d'envoyer le message de défaillance :", replyError);
        }
      }
    });

    this.client.initialize();
  }

  /**
   * Traite les commandes admin WhatsApp (commençant par #)
   */
  private async handleAdminCommand(msg: any, senderNumber: string) {
    const ownerNumber = process.env.BOT_OWNER_NUMBER || '2290190621514@c.us';
    const isAdmin = senderNumber === ownerNumber;

    if (!isAdmin) {
      await msg.reply(`⚠️ Tu n'as pas l'autorisation d'exécuter des commandes d'administration.`);
      return;
    }

    const commandLine = msg.body.substring(1).trim();
    const spaceIndex = commandLine.indexOf(' ');
    const command = spaceIndex === -1 ? commandLine.toLowerCase() : commandLine.substring(0, spaceIndex).toLowerCase();
    const arg = spaceIndex === -1 ? '' : commandLine.substring(spaceIndex + 1).trim();

    try {
      if (command === 'stats') {
        const stats = await this.adminService.getStats();
        const statsMessage =
          `📊 *STATISTIQUES DU BOT* 📊\n\n` +
          `👤 *Utilisateurs :*\n` +
          `• Aujourd'hui : *${stats.users.today}*\n` +
          `• Cette semaine : *${stats.users.thisWeek}*\n` +
          `• Ce mois : *${stats.users.thisMonth}*\n` +
          `• Cette année : *${stats.users.thisYear}*\n` +
          `• Total : *${stats.users.total}*\n\n` +
          `🎮 *Jeux :*\n` +
          `• Action/Vérité : *${stats.games.actionVerite}* parties\n` +
          `• Devinettes : *${stats.games.devinette}* parties\n` +
          `• Autres Jeux : *${stats.games.otherGames}* parties\n` +
          `• Total parties : *${stats.games.totalPlayed}*\n` +
          `• Le plus joué : *${stats.games.mostPlayed}*`;
        await msg.reply(statsMessage);
        await this.adminService.logAdminAction(senderNumber, 'WHATSAPP_STATS', senderNumber);
      } else if (command === 'block') {
        if (!arg) {
          await msg.reply(`⚠️ Spécifie le numéro à bloquer. Exemple : *#block 229XXXXXXXX*`);
          return;
        }

        let target = arg;
        if (!target.endsWith('@c.us')) {
          target = target.replace(/[^\d]/g, '') + '@c.us';
        }

        await this.prisma.user.update({
          where: { phoneNumber: target },
          data: { isBlocked: true },
        });

        await msg.reply(`✅ L'utilisateur *${target.split('@')[0]}* a été bloqué.`);
        await this.adminService.logAdminAction(senderNumber, 'WHATSAPP_BLOCK', target);
      } else if (command === 'unblock') {
        if (!arg) {
          await msg.reply(`⚠️ Spécifie le numéro à débloquer. Exemple : *#unblock 229XXXXXXXX*`);
          return;
        }

        let target = arg;
        if (!target.endsWith('@c.us')) {
          target = target.replace(/[^\d]/g, '') + '@c.us';
        }

        await this.prisma.user.update({
          where: { phoneNumber: target },
          data: { isBlocked: false },
        });

        await msg.reply(`✅ L'utilisateur *${target.split('@')[0]}* a été débloqué.`);
        await this.adminService.logAdminAction(senderNumber, 'WHATSAPP_UNBLOCK', target);
      } else if (command === 'broadcast') {
        if (!arg) {
          await msg.reply(`⚠️ Saisis le message à diffuser. Exemple : *#broadcast Salut à tous !*`);
          return;
        }

        const users = await this.prisma.user.findMany({
          where: { isBlocked: false },
          select: { phoneNumber: true },
        });

        await msg.reply(`📢 Lancement de la diffusion vers *${users.length}* utilisateurs...`);

        let successCount = 0;
        for (const user of users) {
          try {
            await this.client.sendMessage(user.phoneNumber, `📢 *DIFFUSION ADMIN GameBot* 📢\n\n${arg}`);
            successCount++;
            // Petit délai pour éviter de se faire ban par WhatsApp
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (e) {
            this.logger.warn(`Échec de l'envoi broadcast à ${user.phoneNumber} : ${e.message}`);
          }
        }

        await msg.reply(`🏁 Diffusion terminée. Succès : *${successCount}/${users.length}*`);
        await this.adminService.logAdminAction(senderNumber, 'WHATSAPP_BROADCAST', 'ALL_USERS', { message: arg });
      } else if (command === 'addquestion') {
        // Format : #addquestion type | texte | réponse
        const parts = arg.split('|');
        if (parts.length < 2) {
          await msg.reply(
            `⚠️ Format invalide. Exemple :\n*#addquestion QUIZ | Quelle est la capitale du Bénin ? | Porto-Novo*`,
          );
          return;
        }

        const qTypeStr = parts[0].trim().toUpperCase();
        const qText = parts[1].trim();
        const qAnswer = parts[2] ? parts[2].trim() : null;

        const validTypes = ['ACTION', 'VERITE', 'DEVINETTE', 'QUIZ'];
        if (!validTypes.includes(qTypeStr)) {
          await msg.reply(`⚠️ Type de question invalide. Doit être : ACTION, VERITE, DEVINETTE ou QUIZ`);
          return;
        }

        const question = await this.adminService.createQuestion({
          type: qTypeStr as QuestionType,
          text: qText,
          answer: qAnswer,
        });

        await msg.reply(`✅ Question ajoutée avec succès ! ID : *${question.id}*`);
        await this.adminService.logAdminAction(senderNumber, 'WHATSAPP_ADDQUESTION', question.id);
      } else {
        await msg.reply(`⚠️ Commande admin inconnue. Commandes valides : #stats, #block, #unblock, #broadcast, #addquestion`);
      }
    } catch (err) {
      this.errorLogService.logError(`whatsapp.service.admin_command.${command}`, err, Severity.HIGH);
      await msg.reply(`❌ Une erreur est survenue lors de l'exécution de la commande.`);
    }
  }

  private async getMainMenuMessage(firstName: string, tip: string): Promise<string> {
    return (
      `🎉 Bonjour *${firstName}* ! Choisis un jeu :\n\n` +
      `1️⃣ - Action / Vérité 🎭\n\n` +
      `2️⃣ - Devinettes 🧩\n\n` +
      `3️⃣ - Jeu du Pendu 🌳\n\n` +
      `4️⃣ - Morpion ❌⭕\n\n` +
      `5️⃣ - Quiz Culture Générale 🧠\n\n` +
      `6️⃣ - Match Emoji 🎬\n\n` +
      `0️⃣ - Aide ℹ️\n\n` +
      `Réponds avec le numéro du jeu (de *1* à *6*).` +
      tip
    );
  }

  private getHelpMessage(): string {
    return (
      `💡 *AIDE - COMMANDES DISPONIBLES* 💡\n\n` +
      `• */start* ou */restart* : Démarrer ou relancer le bot\n` +
      `• */stop* ou */close* : Mettre le bot en pause (veille)\n` +
      `• */menu* ou */retour* : Retourner au menu principal\n` +
      `• */help* ou */aide* : Afficher ce message d'aide\n` +
      `• */ping* : Tester si le bot est en ligne`
    );
  }

  private normalizeText(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }
}
