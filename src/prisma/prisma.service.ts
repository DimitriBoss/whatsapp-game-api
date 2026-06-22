import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
      }),
    });
  }
  async onModuleInit() {
    await this.$connect(); // Connexion à la base de données
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Déconnexion propre à l'arrêt du serveur
  }
}
