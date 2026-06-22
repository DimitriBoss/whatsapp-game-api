import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';

import { GameService } from '../game/game.service';

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
          },
        },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
