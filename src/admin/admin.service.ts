import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionType, Difficulty, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retourne les statistiques globales de l'application
   */
  async getStats() {
    const now = new Date();

    // Début de journée
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Début de semaine (Lundi)
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);

    // Début du mois
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Début de l'année
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Requêtes de comptage des utilisateurs
    const totalUsers = await this.prisma.user.count();
    const usersToday = await this.prisma.user.count({
      where: { createdAt: { gte: startOfToday } },
    });
    const usersThisWeek = await this.prisma.user.count({
      where: { createdAt: { gte: startOfWeek } },
    });
    const usersThisMonth = await this.prisma.user.count({
      where: { createdAt: { gte: startOfMonth } },
    });
    const usersThisYear = await this.prisma.user.count({
      where: { createdAt: { gte: startOfYear } },
    });

    // Agrégations pour les statistiques des jeux
    const gameStats = await this.prisma.user.aggregate({
      _sum: {
        playedActionVerite: true,
        playedDevinette: true,
        playedCount: true,
      },
    });

    const sumActionVerite = gameStats._sum.playedActionVerite || 0;
    const sumDevinette = gameStats._sum.playedDevinette || 0;
    const sumPlayedCount = gameStats._sum.playedCount || 0;
    
    // Les autres jeux correspondent à playedCount moins Action/Vérité et Devinettes
    const sumOtherGames = Math.max(0, sumPlayedCount - (sumActionVerite + sumDevinette));

    // Détermination du jeu le plus joué
    let mostPlayed = 'Aucun jeu joué';
    const counts = [
      { name: 'Action / Vérité', count: sumActionVerite },
      { name: 'Devinettes', count: sumDevinette },
      { name: 'Nouveaux Jeux (Pendu/Morpion/Quiz/Emoji)', count: sumOtherGames },
    ];
    counts.sort((a, b) => b.count - a.count);

    if (counts[0].count > 0) {
      mostPlayed = `${counts[0].name} (${counts[0].count} parties)`;
    }

    return {
      users: {
        today: usersToday,
        thisWeek: usersThisWeek,
        thisMonth: usersThisMonth,
        thisYear: usersThisYear,
        total: totalUsers,
      },
      games: {
        actionVerite: sumActionVerite,
        devinette: sumDevinette,
        otherGames: sumOtherGames,
        totalPlayed: sumPlayedCount,
        mostPlayed,
      },
    };
  }

  /**
   * Récupère la liste paginée des erreurs loguées
   */
  async getErrors(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.errorLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.errorLog.count(),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Récupère les utilisateurs avec filtre optionnel
   */
  async getUsers(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  /**
   * Récupère toutes les sessions actives (dernières activités d'abord)
   */
  async getSessions() {
    return this.prisma.gameSession.findMany({
      orderBy: { lastActivityAt: 'desc' },
    });
  }

  /**
   * CRUD Question : Création
   */
  async createQuestion(data: {
    text: string;
    answer?: string;
    type: QuestionType;
    category?: string;
    difficulty?: Difficulty;
    language?: string;
  }) {
    return this.prisma.question.create({
      data,
    });
  }

  /**
   * CRUD Question : Modification
   */
  async updateQuestion(
    id: string,
    data: {
      text?: string;
      answer?: string;
      type?: QuestionType;
      category?: string;
      difficulty?: Difficulty;
      language?: string;
      active?: boolean;
    },
  ) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  /**
   * CRUD Question : Suppression logique (active = false)
   */
  async deleteQuestion(id: string) {
    return this.prisma.question.update({
      where: { id },
      data: { active: false },
    });
  }

  /**
   * Enregistre une action administrative dans les audits logs
   */
  async logAdminAction(actorId: string, action: string, target: string, metadata?: any) {
    return this.prisma.adminLog.create({
      data: {
        actorId,
        action,
        target,
        metadata: metadata || null,
      },
    });
  }
}
