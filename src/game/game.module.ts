import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [GameService],
  exports: [GameService], // 🔧 FIX : exporté pour que WhatsappModule puisse l'utiliser
})
export class GameModule {}
