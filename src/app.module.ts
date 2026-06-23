import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GameModule } from './game/game.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    PrismaModule,
    GameModule,
    WhatsappModule,
    AdminModule,
    CommonModule,
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
