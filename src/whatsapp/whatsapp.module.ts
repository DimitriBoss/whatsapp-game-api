import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { GameModule } from '../game/game.module';

@Module({
  imports: [GameModule],
  providers: [WhatsappService],
  exports: [WhatsappService], // ✅ Exporté pour que AppModule puisse l'utiliser
})
export class WhatsappModule {}
