import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, GameModule, WhatsappModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
