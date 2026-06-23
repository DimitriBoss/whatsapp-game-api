import { Injectable } from '@nestjs/common';

@Injectable()
export class RateLimitGuard {
  // Map stockant le chatId et un tableau de timestamps de ses messages
  private requests = new Map<string, number[]>();

  /**
   * Vérifie si un utilisateur est limité par le débit (rate limit)
   * @param chatId Identifiant unique de l'utilisateur ou du groupe
   * @returns true si l'utilisateur dépasse la limite, false sinon
   */
  isRateLimited(chatId: string): boolean {
    const now = Date.now();
    // Valeurs par défaut : 30 messages max toutes les 60 secondes
    const windowMs = (Number(process.env.RATE_LIMIT_WINDOW) || 60) * 1000;
    const maxRequests = Number(process.env.RATE_LIMIT_MAX) || 30;

    let timestamps = this.requests.get(chatId) || [];

    // On ne garde que les messages envoyés dans la fenêtre temporelle actuelle
    timestamps = timestamps.filter((time) => now - time < windowMs);

    if (timestamps.length >= maxRequests) {
      return true;
    }

    // Ajouter le nouveau message à l'historique
    timestamps.push(now);
    this.requests.set(chatId, timestamps);
    return false;
  }
}
