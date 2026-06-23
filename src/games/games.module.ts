import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GameModule } from '../game/game.module';
import { PenduService } from './pendu/pendu.service';
import { MorpionService } from './morpion/morpion.service';
import { QuizService } from './quiz/quiz.service';
import { EmojiService } from './emoji/emoji.service';

@Module({
  imports: [PrismaModule, GameModule],
  providers: [PenduService, MorpionService, QuizService, EmojiService],
  exports: [PenduService, MorpionService, QuizService, EmojiService],
})
export class GamesModule {}
