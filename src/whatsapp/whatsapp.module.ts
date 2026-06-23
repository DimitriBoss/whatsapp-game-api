import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { GameModule } from '../game/game.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { GamesModule } from '../games/games.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    GameModule,
    PrismaModule,
    CommonModule,
    GamesModule,
    AdminModule,
  ],
  providers: [WhatsappService],
  exports: [WhatsappService], // Exporté pour que AppModule puisse l'utiliser
})
export class WhatsappModule {}
