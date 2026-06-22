import { Injectable } from '@nestjs/common';
import { BotState, QuestionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateUser(contact: string) {
    let user = await this.prisma.user.findUnique({
      where: { phoneNumber: contact },
    });

    // 🔧 FIX : on assigne le résultat du create à "user"
    // Avant : await this.prisma.user.create(...) sans assigner → retournait null
    if (!user) {
      user = await this.prisma.user.create({
        data: { phoneNumber: contact },
      });
    }

    return user; // ✅ retourne toujours un utilisateur valide
  }

  async getRandomQuestion(chatId: string, type: QuestionType) {
    let session = await this.prisma.gameSession.findUnique({
      where: { chatId },
    });

    if (!session) {
      session = await this.prisma.gameSession.create({
        data: { chatId, history: [] },
      });
    }

    const history = session.history || [];

    let questions = await this.prisma.question.findMany({
      where: {
        type,
        id: {
          notIn: history,
        },
      },
    });

    if (questions.length === 0) {
      questions = await this.prisma.question.findMany({
        where: { type },
      });

      if (questions.length === 0) return null;

      await this.prisma.gameSession.update({
        where: { chatId },
        data: { history: [] },
      });
    }

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    await this.prisma.gameSession.update({
      where: { chatId },
      data: {
        history: {
          push: randomQuestion.id,
        },
      },
    });

    return randomQuestion;
  }

  // 🆕 AJOUT : mise à jour de l'état du bot pour un utilisateur
  // Nécessaire pour le state machine : START → MAIN_MENU → PLAYING...
  async updateUserState(phoneNumber: string, state: BotState) {
    return this.prisma.user.update({
      where: { phoneNumber },
      data: { botState: state },
    });
  }

  async updateGameSession(chatId: string, questionId?: string | null, attempts: number = 0) {
    return this.prisma.gameSession.upsert({
      where: { chatId },
      update: {
        currentQuestionId: questionId || null,
        attempts,
      },
      create: {
        chatId,
        currentQuestionId: questionId || null,
        attempts,
        history: [],
      },
    });
  }

  async getGameSession(chatId: string) {
    return this.prisma.gameSession.findUnique({
      where: { chatId },
    });
  }

  async getQuestionById(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  // Sauvegarde le prénom quand l'utilisateur répond au bot
  async setUserFirstName(phoneNumber: string, firstName: string) {
    return this.prisma.user.update({
      where: { phoneNumber },
      data: { firstName },
    });
  }
}
