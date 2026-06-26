import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';

import { PrismaService } from '../prisma/prisma.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
            question: { findMany: jest.fn(), findUnique: jest.fn() },
            gameSession: { findUnique: jest.fn(), upsert: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateGameSessionWithData', () => {
    it('should correctly prioritize and merge new gameData properties over existing session data', async () => {
      const mockFindUnique = jest.fn().mockResolvedValue({
        chatId: 'test-chat',
        currentGame: 'group_setup',
        gameData: {
          mode: 'awaiting_challenge_mention',
          player1: 'p1-id',
        },
      });
      const mockUpsert = jest.fn().mockImplementation((args) => args.update);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          GameService,
          {
            provide: PrismaService,
            useValue: {
              gameSession: {
                findUnique: mockFindUnique,
                upsert: mockUpsert,
              },
            },
          },
        ],
      }).compile();

      const gameService = module.get<GameService>(GameService);

      const result = await gameService.updateGameSessionWithData('test-chat', 'morpion', {
        mode: 'multi',
        gameId: 'new-game-id',
        role: 'player1',
      });

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { chatId: 'test-chat' } });
      expect(mockUpsert).toHaveBeenCalled();
      expect(result.gameData).toEqual({
        mode: 'multi',
        gameId: 'new-game-id',
        role: 'player1',
        player1: 'p1-id',
        player2: undefined,
      });
    });
  });
});
