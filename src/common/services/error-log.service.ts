import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Severity } from '@prisma/client';

@Injectable()
export class ErrorLogService {
  private readonly logger = new Logger(ErrorLogService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Enregistre une erreur dans la base de données et dans la console système.
   * @param scope Le composant d'origine de l'erreur (ex: "whatsapp.service")
   * @param error L'objet d'erreur ou le message
   * @param severity Le niveau de gravité (LOW, MEDIUM, HIGH, CRITICAL)
   */
  async logError(scope: string, error: any, severity: Severity = Severity.MEDIUM) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    // Log dans la console système
    if (severity === Severity.CRITICAL || severity === Severity.HIGH) {
      this.logger.error(`[${scope}] [${severity}] ${message}`, stack);
    } else {
      this.logger.warn(`[${scope}] [${severity}] ${message}`);
    }

    // Enregistrement dans la base de données
    try {
      await this.prisma.errorLog.create({
        data: {
          scope,
          message,
          stack,
          severity,
        },
      });
    } catch (dbError) {
      this.logger.error(
        `Impossible d'enregistrer l'erreur dans la BDD : ${dbError.message}`,
        dbError.stack,
      );
    }
  }
}
