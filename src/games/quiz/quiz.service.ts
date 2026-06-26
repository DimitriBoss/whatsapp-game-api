import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameService } from '../../game/game.service';
import { QuestionType, BotState } from '@prisma/client';

interface QuizState {
  questionIds: string[];
  currentIndex: number;
  score: number;
  total: number;
}

@Injectable()
export class QuizService {
  constructor(
    private prisma: PrismaService,
    private gameService: GameService,
  ) {}

  /**
   * Démarre une session de Quiz de 10 questions
   */
  async startQuiz(chatId: string): Promise<string> {
    // Récupérer toutes les questions de type QUIZ actives
    const allQuestions = await this.prisma.question.findMany({
      where: {
        type: QuestionType.QUIZ,
        active: true,
      },
      select: { id: true },
    });

    if (allQuestions.length === 0) {
      return (
        `⚠️ Désolé, aucune question de Quiz n'est disponible en base de données pour le moment.\n` +
        `Envoie *0* pour retourner au menu principal.`
      );
    }

    // Mélanger et sélectionner jusqu'à 10 questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, 10).map((q) => q.id);

    const state: QuizState = {
      questionIds: selectedIds,
      currentIndex: 0,
      score: 0,
      total: selectedIds.length,
    };

    await this.gameService.updateGameSessionWithData(chatId, 'quiz', state);

    // Récupérer la première question
    const firstQuestion = await this.prisma.question.findUnique({
      where: { id: selectedIds[0] },
    });

    return (
      `🧠 *QUIZ CULTURE GÉNÉRALE* 🧠\n\n` +
      `Prépare-toi pour une série de *${state.total}* questions !\n` +
      `Réponds en envoyant le numéro de la bonne option (1, 2, 3...) ou le texte de la réponse.\n\n` +
      `*Question 1/${state.total}* :\n` +
      `${firstQuestion?.text}\n\n` +
      `💡 _Astuce : Tape *0* à tout moment pour abandonner et retourner au menu principal._`
    );
  }

  /**
   * Traite la réponse à la question en cours
   */
  async handleAnswer(sessionKey: string, senderNumber: string, input: string, currentData: any): Promise<string> {
    if (!currentData || !currentData.questionIds) {
      return await this.startQuiz(sessionKey);
    }

    const state = currentData as QuizState;
    const currentQuestionId = state.questionIds[state.currentIndex];

    const question = await this.prisma.question.findUnique({
      where: { id: currentQuestionId },
    });

    if (!question) {
      return `⚠️ Une erreur s'est produite lors de la récupération de la question. Envoie *suivant* pour passer.`;
    }

    // Vérifier la réponse
    const normalizedUserAnswer = this.normalizeText(input);
    const answersList = question.answer ? question.answer.split('|') : [];
    
    const isCorrect = answersList.some(
      (ans) => this.normalizeText(ans) === normalizedUserAnswer,
    );

    let feedback = '';
    if (isCorrect) {
      state.score++;
      feedback = `✅ *Bonne réponse !* 🥳`;
    } else {
      const mainAnswer = answersList[0] || 'Inconnue';
      feedback = `❌ *Mauvaise réponse !* 😢\n💡 La bonne réponse était : *${mainAnswer}*`;
    }

    // Passer à la question suivante
    state.currentIndex++;

    // Vérifier si le quiz est fini
    if (state.currentIndex >= state.total) {
      await this.gameService.updateGameSessionWithData(sessionKey, null, null);
      await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
      
      // Incrémenter le compteur de jeu de l'utilisateur
      await this.gameService.incrementPlayedCount(senderNumber);

      const pointsWon = state.score * 5;
      const newPoints = await this.gameService.incrementUserPoints(senderNumber, pointsWon);

      let finalComment = '';
      if (state.score === state.total) {
        finalComment = `🏆 *Score parfait ! Tu es un génie absolu !* 👑`;
      } else if (state.score >= 7) {
        finalComment = `🎉 *Excellent score ! Tu as une très bonne culture générale !* 👏`;
      } else if (state.score >= 5) {
        finalComment = `👍 *Pas mal ! Tu as la moyenne, continue comme ça !* 😊`;
      } else {
        finalComment = `📚 *Peut mieux faire ! C'est l'occasion d'apprendre de nouvelles choses !* 💪`;
      }

      return (
        `${feedback}\n\n` +
        `🏁 *QUIZ TERMINÉ !* 🏁\n\n` +
        `Ton score final : *${state.score}/${state.total}*\n` +
        `🏆 Tu gagnes *+${pointsWon} points* ! (Total : *${newPoints}* pts)\n\n` +
        `${finalComment}\n\n` +
        `_(Envoie *5* pour relancer un Quiz, ou *0* pour retourner au menu principal)_`
      );
    }

    // Sauvegarder l'état
    await this.gameService.updateGameSessionWithData(sessionKey, 'quiz', state);

    // Poser la question suivante
    const nextQuestionId = state.questionIds[state.currentIndex];
    const nextQuestion = await this.prisma.question.findUnique({
      where: { id: nextQuestionId },
    });

    return (
      `${feedback}\n\n` +
      `*Question ${state.currentIndex + 1}/${state.total}* :\n` +
      `${nextQuestion?.text}\n\n` +
      `💡 _Astuce : Tape *0* pour le menu._`
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
