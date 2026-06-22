import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();

    // Calcul des dates de début
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
      },
    });

    const sumActionVerite = gameStats._sum.playedActionVerite || 0;
    const sumDevinette = gameStats._sum.playedDevinette || 0;

    let mostPlayed = 'Aucun jeu joué';
    if (sumActionVerite > sumDevinette) {
      mostPlayed = 'Action / Vérité';
    } else if (sumDevinette > sumActionVerite) {
      mostPlayed = 'Devinette';
    } else if (sumActionVerite > 0) {
      mostPlayed = 'Égalité (Action / Vérité & Devinette)';
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
        mostPlayed,
      },
    };
  }
}
