const mockClient = {
  on: jest.fn(),
  sendMessage: jest.fn().mockResolvedValue({}),
  initialize: jest.fn().mockResolvedValue({}),
  info: { wid: { _serialized: 'bot-id@c.us' } },
};

jest.mock('whatsapp-web.js', () => {
  return {
    Client: jest.fn().mockImplementation(() => mockClient),
    LocalAuth: jest.fn().mockImplementation(() => ({})),
  };
});

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
import { BotState, QuestionType } from '@prisma/client';

describe('WhatsappService', () => {
  let service: WhatsappService;
  let gameService: GameService;
  let morpionService: MorpionService;
  let penduService: PenduService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    mockClient.on.mockClear();
    mockClient.sendMessage.mockClear();
    mockClient.initialize.mockClear();

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
            incrementUserQuestionCount: jest.fn(),
            incrementUserPoints: jest.fn(),
            incrementPlayedCount: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              count: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
            morpionGame: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: PenduService,
          useValue: {
            startGame: jest.fn().mockResolvedValue('🎮 Nouveau pendu'),
          },
        },
        {
          provide: MorpionService,
          useValue: {
            startSoloGame: jest.fn(),
            handleSoloMove: jest.fn(),
            createMultiplayerGame: jest.fn(),
            joinMultiplayerGame: jest.fn(),
            handleMultiplayerMove: jest.fn(),
            renderBoard: jest.fn().mockReturnValue('board'),
          },
        },
        { provide: QuizService, useValue: {} },
        { provide: EmojiService, useValue: {} },
        {
          provide: RateLimitGuard,
          useValue: { isRateLimited: jest.fn().mockReturnValue(false) },
        },
        { provide: ErrorLogService, useValue: { logError: jest.fn() } },
        { provide: AdminService, useValue: {} },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
    gameService = module.get<GameService>(GameService);
    morpionService = module.get<MorpionService>(MorpionService);
    penduService = module.get<PenduService>(PenduService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should restart a pendu game directly when the user says replay', async () => {
    const mockMsg = {
      from: 'user-number@c.us',
      body: 'rejouer',
      reply: jest.fn().mockResolvedValue({}),
      mentionedIds: [],
    };

    jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
      id: 'user-id',
      phoneNumber: 'user-number@c.us',
      firstName: 'Dimitri',
      lastName: null,
      botState: BotState.MAIN_MENU,
      playedActionVerite: 0,
      playedDevinette: 0,
      playedCount: 0,
      points: 10,
      role: 'USER',
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
      id: 'session-id',
      chatId: 'user-number@c.us',
      currentQuestionId: null,
      attempts: 0,
      history: [],
      currentGame: 'pendu',
      gameData: null,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const updateStateSpy = jest
      .spyOn(gameService, 'updateUserState')
      .mockResolvedValue({} as any);
    const startGameSpy = jest
      .spyOn(penduService, 'startGame')
      .mockResolvedValue('🎮 Nouveau pendu');

    service.onModuleInit();
    const messageCall = mockClient.on.mock.calls.find(
      (call) => call[0] === 'message',
    );
    const messageListener = messageCall[1];

    await messageListener(mockMsg);

    expect(updateStateSpy).toHaveBeenCalledWith(
      'user-number@c.us',
      BotState.PLAYING_PENDU,
    );
    expect(startGameSpy).toHaveBeenCalledWith('user-number@c.us');
    expect(mockMsg.reply).toHaveBeenCalledWith('🎮 Nouveau pendu');
  });

  describe('PLAYING_DEVINETTE state in Solo Mode', () => {
    let messageListener: (msg: any) => Promise<void>;

    beforeEach(() => {
      // Get the message listener registered on initialisation
      service.onModuleInit();
      const messageCall = mockClient.on.mock.calls.find(
        (call) => call[0] === 'message',
      );
      messageListener = messageCall[1];
    });

    it('should verify correct answer in DMs (solo) and award points', async () => {
      const mockMsg = {
        from: 'user-number@c.us',
        body: 'dja',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.PLAYING_DEVINETTE,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
        id: 'session-id',
        chatId: 'user-number@c.us',
        currentQuestionId: 'question-id',
        attempts: 0,
        history: [],
        currentGame: null,
        gameData: null,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getQuestionById').mockResolvedValue({
        id: 'question-id',
        text: 'Qui suis-je ?',
        answer: 'dja|sauce dja',
        type: QuestionType.DEVINETTE,
        category: null,
        difficulty: 'EASY',
        language: 'fr',
        active: true,
        createdAt: new Date(),
      });

      const updateSessionSpy = jest
        .spyOn(gameService, 'updateGameSession')
        .mockResolvedValue({} as any);
      const incrementPointsSpy = jest
        .spyOn(gameService, 'incrementUserPoints')
        .mockResolvedValue(20);

      await messageListener(mockMsg);

      expect(updateSessionSpy).toHaveBeenCalledWith(
        'user-number@c.us',
        null,
        0,
      );
      expect(incrementPointsSpy).toHaveBeenCalledWith('user-number@c.us', 10);
      expect(mockMsg.reply).toHaveBeenCalledWith(
        expect.stringContaining('Félicitations'),
      );
    });

    it('should increment attempts on incorrect answer', async () => {
      const mockMsg = {
        from: 'user-number@c.us',
        body: 'wrong answer',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.PLAYING_DEVINETTE,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
        id: 'session-id',
        chatId: 'user-number@c.us',
        currentQuestionId: 'question-id',
        attempts: 0,
        history: [],
        currentGame: null,
        gameData: null,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getQuestionById').mockResolvedValue({
        id: 'question-id',
        text: 'Qui suis-je ?',
        answer: 'dja|sauce dja',
        type: QuestionType.DEVINETTE,
        category: null,
        difficulty: 'EASY',
        language: 'fr',
        active: true,
        createdAt: new Date(),
      });

      const updateSessionSpy = jest
        .spyOn(gameService, 'updateGameSession')
        .mockResolvedValue({} as any);

      await messageListener(mockMsg);

      expect(updateSessionSpy).toHaveBeenCalledWith(
        'user-number@c.us',
        'question-id',
        1,
      );
      expect(mockMsg.reply).toHaveBeenCalledWith(
        expect.stringContaining('Mauvaise réponse'),
      );
    });

    it('should reveal the answer and reset attempts on 3rd incorrect answer', async () => {
      const mockMsg = {
        from: 'user-number@c.us',
        body: 'wrong answer again',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.PLAYING_DEVINETTE,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
        id: 'session-id',
        chatId: 'user-number@c.us',
        currentQuestionId: 'question-id',
        attempts: 2,
        history: [],
        currentGame: null,
        gameData: null,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getQuestionById').mockResolvedValue({
        id: 'question-id',
        text: 'Qui suis-je ?',
        answer: 'dja|sauce dja',
        type: QuestionType.DEVINETTE,
        category: null,
        difficulty: 'EASY',
        language: 'fr',
        active: true,
        createdAt: new Date(),
      });

      const updateSessionSpy = jest
        .spyOn(gameService, 'updateGameSession')
        .mockResolvedValue({} as any);

      await messageListener(mockMsg);

      expect(updateSessionSpy).toHaveBeenCalledWith(
        'user-number@c.us',
        null,
        0,
      );
      expect(mockMsg.reply).toHaveBeenCalledWith(
        expect.stringContaining('Dommage'),
      );
    });
  });

  describe('PLAYING_DEVINETTE state in Group Mode', () => {
    let messageListener: (msg: any) => Promise<void>;

    beforeEach(() => {
      service.onModuleInit();
      const messageCall = mockClient.on.mock.calls.find(
        (call) => call[0] === 'message',
      );
      messageListener = messageCall[1];
    });

    it('should ignore group message if no prefix is provided', async () => {
      const mockMsg = {
        from: 'group-id@g.us',
        author: 'user-number@c.us',
        body: 'dja',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.MAIN_MENU,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
        id: 'session-id',
        chatId: 'group-id@g.us',
        currentQuestionId: 'question-id',
        attempts: 0,
        history: [],
        currentGame: 'devinette',
        gameData: { mode: 'group' },
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      });

      await messageListener(mockMsg);

      expect(mockMsg.reply).not.toHaveBeenCalled();
    });

    it('should verify group message if prefix r: is provided', async () => {
      const mockMsg = {
        from: 'group-id@g.us',
        author: 'user-number@c.us',
        body: 'r: dja',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.MAIN_MENU,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
        id: 'session-id',
        chatId: 'group-id@g.us',
        currentQuestionId: 'question-id',
        attempts: 0,
        history: [],
        currentGame: 'devinette',
        gameData: { mode: 'group' },
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      });

      jest.spyOn(gameService, 'getQuestionById').mockResolvedValue({
        id: 'question-id',
        text: 'Qui suis-je ?',
        answer: 'dja|sauce dja',
        type: QuestionType.DEVINETTE,
        category: null,
        difficulty: 'EASY',
        language: 'fr',
        active: true,
        createdAt: new Date(),
      });

      const updateSessionSpy = jest
        .spyOn(gameService, 'updateGameSession')
        .mockResolvedValue({} as any);

      await messageListener(mockMsg);

      expect(updateSessionSpy).toHaveBeenCalledWith('group-id@g.us', null, 0);
      expect(mockMsg.reply).toHaveBeenCalledWith(
        expect.stringContaining('Félicitations'),
      );
    });
  });

  describe('PLAYING_MORPION state in Solo Mode', () => {
    let messageListener: (msg: any) => Promise<void>;

    beforeEach(() => {
      service.onModuleInit();
      const messageCall = mockClient.on.mock.calls.find(
        (call) => call[0] === 'message',
      );
      messageListener = messageCall[1];
    });

    it('should forward move to morpionService.handleSoloMove', async () => {
      const mockMsg = {
        from: 'user-number@c.us',
        body: '5',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.PLAYING_MORPION,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockGameData = {
        mode: 'solo',
        board: '         ',
        difficulty: 'HARD',
      };
      jest.spyOn(gameService, 'getGameSession').mockResolvedValue({
        id: 'session-id',
        chatId: 'user-number@c.us',
        currentQuestionId: null,
        attempts: 0,
        history: [],
        currentGame: 'morpion',
        gameData: mockGameData,
        lastActivityAt: new Date(),
        updatedAt: new Date(),
      });

      const handleMoveSpy = jest
        .spyOn(morpionService, 'handleSoloMove')
        .mockResolvedValue('morpion board response');

      await messageListener(mockMsg);

      expect(handleMoveSpy).toHaveBeenCalledWith(
        'user-number@c.us',
        'user-number@c.us',
        '5',
        mockGameData,
      );
      expect(mockMsg.reply).toHaveBeenCalledWith('morpion board response');
    });
  });

  describe('PLAYING_MORPION state in Group Mode', () => {
    let messageListener: (msg: any) => Promise<void>;

    beforeEach(() => {
      service.onModuleInit();
      const messageCall = mockClient.on.mock.calls.find(
        (call) => call[0] === 'message',
      );
      messageListener = messageCall[1];
    });

    it('should forward move to morpionService.handleMultiplayerMove with groupChatId', async () => {
      const mockMsg = {
        from: 'group-id@g.us',
        author: 'user-number@c.us',
        body: '5',
        reply: jest.fn().mockResolvedValue({}),
        mentionedIds: [],
      };

      jest.spyOn(gameService, 'getOrCreateUser').mockResolvedValue({
        id: 'user-id',
        phoneNumber: 'user-number@c.us',
        firstName: 'Dimitri',
        lastName: null,
        botState: BotState.PLAYING_MORPION,
        playedActionVerite: 0,
        playedDevinette: 0,
        playedCount: 0,
        points: 10,
        role: 'USER',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const mockGameData = {
        mode: 'multi',
        gameId: 'game-id',
        role: 'player1',
        groupChatId: 'group-id@g.us',
      };
      // Individual session in group
      jest
        .spyOn(gameService, 'getGameSession')
        .mockImplementation(async (chatId) => {
          if (chatId === 'group-id@g.us:user-number@c.us') {
            return {
              id: 'session-id',
              chatId: 'group-id@g.us:user-number@c.us',
              currentQuestionId: null,
              attempts: 0,
              history: [],
              currentGame: 'morpion',
              gameData: mockGameData,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as any;
          }
          return null;
        });

      const handleMoveSpy = jest
        .spyOn(morpionService, 'handleMultiplayerMove')
        .mockResolvedValue({
          success: true,
          message: 'move played',
          shouldNotifyAdversary: false,
        });

      await messageListener(mockMsg);

      expect(handleMoveSpy).toHaveBeenCalledWith(
        'user-number@c.us',
        '5',
        'game-id',
        'player1',
        true,
        'group-id@g.us',
      );
    });
  });
});
