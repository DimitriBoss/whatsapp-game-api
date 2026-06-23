import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { GameService } from '../game/game.service';
import { PrismaService } from '../prisma/prisma.service';
import { PenduService } from '../games/pendu/pendu.service';
import { MorpionService } from '../games/morpion/morpion.service';
import { QuizService } from '../games/quiz/quiz.service';
import { EmojiService } from '../games/emoji/emoji.service';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { ErrorLogService } from '../common/services/error-log.service';
import { AdminService } from '../admin/admin.service';

describe('WhatsappService', () => {
  let service: WhatsappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        {
          provide: GameService,
          useValue: {
            getOrCreateUser: jest.fn(),
            getRandomQuestion: jest.fn(),
            updateUserState: jest.fn(),
            updateGameSession: jest.fn(),
            getGameSession: jest.fn(),
            getQuestionById: jest.fn(),
            setUserFirstName: jest.fn(),
            updateGameSessionWithData: jest.fn(),
          },
        },
        { provide: PrismaService, useValue: {} },
        { provide: PenduService, useValue: {} },
        { provide: MorpionService, useValue: {} },
        { provide: QuizService, useValue: {} },
        { provide: EmojiService, useValue: {} },
        { provide: RateLimitGuard, useValue: { isRateLimited: jest.fn() } },
        { provide: ErrorLogService, useValue: { logError: jest.fn() } },
        { provide: AdminService, useValue: {} },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
