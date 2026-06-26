import { Test, TestingModule } from '@nestjs/testing';
import { MorpionService } from './morpion.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GameService } from '../../game/game.service';

describe('MorpionService', () => {
  let service: MorpionService;
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MorpionService,
        {
          provide: PrismaService,
          useValue: {
            morpionGame: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: GameService,
          useValue: {
            updateGameSessionWithData: jest.fn(),
            incrementUserPoints: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MorpionService>(MorpionService);
    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleSoloMove', () => {
    it('should place X at the user position and make O play via AI', async () => {
      const state = {
        board: '         ',
        mode: 'solo' as const,
        difficulty: 'HARD' as const,
      };

      const result = await service.handleSoloMove('session-key', 'user-number', '5', state);

      // Board rendering should show ❌ at position 5
      expect(result).toContain('❌');
      // Board rendering should show ⭕ at some other position (since bot plays)
      expect(result).toContain('⭕');
      // The state board should have been updated with both moves
      expect(state.board).toContain('X');
      expect(state.board).toContain('O');
      expect(gameService.updateGameSessionWithData).toHaveBeenCalledWith('session-key', 'morpion', state);
    });

    it('should reject already occupied cell', async () => {
      const state = {
        board: '    X    ',
        mode: 'solo' as const,
        difficulty: 'HARD' as const,
      };

      const result = await service.handleSoloMove('session-key', 'user-number', '5', state);
      expect(result).toContain('déjà occupée');
    });
  });
});
