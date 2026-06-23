import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameService } from '../../game/game.service';
import { MorpionStatus } from '@prisma/client';

interface SoloMorpionState {
  board: string; // "         " (9 chars)
  mode: 'solo';
  difficulty: 'EASY' | 'HARD';
}

@Injectable()
export class MorpionService {
  constructor(
    private prisma: PrismaService,
    private gameService: GameService,
  ) {}

  /**
   * Démarre une partie en mode Solo (contre l'IA)
   */
  async startSoloGame(chatId: string, difficulty: 'EASY' | 'HARD' = 'HARD'): Promise<string> {
    const state: SoloMorpionState = {
      board: '         ',
      mode: 'solo',
      difficulty,
    };

    await this.gameService.updateGameSessionWithData(chatId, 'morpion', state);

    return (
      `❌ *MORPION SOLO (vs IA)* ⭕\n\n` +
      `Difficulté : *${difficulty === 'HARD' ? 'Imbattable (IA)' : 'Facile'}*\n` +
      `Tu es les *❌* et l'IA est les *⭕*.\n` +
      `Tu commences ! Envoie le numéro d'une case libre (1 à 9) pour jouer.\n\n` +
      `${this.renderBoard('         ')}\n\n` +
      `_(Pour quitter, envoie *0* ou */retour*)_`
    );
  }

  /**
   * Gère le coup en mode Solo
   */
  async handleSoloMove(chatId: string, input: string, state: SoloMorpionState): Promise<string> {
    const position = parseInt(input.trim(), 10);
    if (isNaN(position) || position < 1 || position > 9) {
      return `⚠️ Envoie un chiffre entre *1* et *9* correspondant à une case libre.`;
    }

    const boardArray = state.board.split('');
    const index = position - 1;

    if (boardArray[index] !== ' ') {
      return (
        `⚠️ La case *${position}* est déjà occupée !\n\n` +
        `${this.renderBoard(state.board)}`
      );
    }

    // Le joueur joue X
    boardArray[index] = 'X';
    let boardStr = boardArray.join('');

    // Vérifier si le joueur a gagné
    let check = this.checkWinner(boardStr);
    if (check.status === 'WIN') {
      await this.gameService.updateGameSessionWithData(chatId, null, null);
      return (
        `🎉 *FÉLICITATIONS !* Tu as battu l'IA au Morpion ! 🥳\n\n` +
        `${this.renderBoard(boardStr)}\n\n` +
        `_(Envoie *1* pour rejouer en Difficile, *2* en Facile, ou *0* pour le menu)_`
      );
    } else if (check.status === 'DRAW') {
      await this.gameService.updateGameSessionWithData(chatId, null, null);
      return (
        `🤝 *ÉGALITÉ !* Belle partie.\n\n` +
        `${this.renderBoard(boardStr)}\n\n` +
        `_(Envoie *1* pour rejouer en Difficile, *2* en Facile, ou *0* pour le menu)_`
      );
    }

    // Le bot joue O
    const botIndex = this.getBotMove(boardArray, state.difficulty);
    if (botIndex !== -1) {
      boardArray[botIndex] = 'O';
      boardStr = boardArray.join('');
    }

    // Vérifier si le bot a gagné
    check = this.checkWinner(boardStr);
    if (check.status === 'WIN' && check.winner === 'O') {
      await this.gameService.updateGameSessionWithData(chatId, null, null);
      return (
        `🤖 *DOMMAGE !* L'IA a gagné cette partie. 🦾\n\n` +
        `${this.renderBoard(boardStr)}\n\n` +
        `_(Envoie *1* pour rejouer en Difficile, *2* en Facile, ou *0* pour le menu)_`
      );
    } else if (check.status === 'DRAW') {
      await this.gameService.updateGameSessionWithData(chatId, null, null);
      return (
        `🤝 *ÉGALITÉ !* Belle partie.\n\n` +
        `${this.renderBoard(boardStr)}\n\n` +
        `_(Envoie *1* pour rejouer en Difficile, *2* en Facile, ou *0* pour le menu)_`
      );
    }

    // Continuer le jeu
    state.board = boardStr;
    await this.gameService.updateGameSessionWithData(chatId, 'morpion', state);

    return (
      `🤖 L'IA a joué en case *${botIndex + 1}*.\n` +
      `À ton tour ! Envoie un chiffre entre 1 et 9.\n\n` +
      `${this.renderBoard(boardStr)}\n\n` +
      `_(Pour quitter, envoie *0* ou */retour*)_`
    );
  }

  /**
   * MULTIJOUEUR : Génère un code d'invitation pour un jeu multijoueur
   */
  async createMultiplayerGame(player1ChatId: string): Promise<{ code: string; message: string }> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const game = await this.prisma.morpionGame.create({
      data: {
        inviteCode: code,
        player1ChatId,
        status: MorpionStatus.WAITING,
        board: '         ',
      },
    });

    // On met à jour la session du joueur 1 en mode Morpion Multi
    await this.gameService.updateGameSessionWithData(player1ChatId, 'morpion', {
      mode: 'multi',
      gameId: game.id,
      role: 'player1',
    });

    return {
      code,
      message:
        `🎮 *MORPION MULTIJOUEUR* 🎮\n\n` +
        `Ta partie a été créée avec succès ! 🚀\n` +
        `Partage ce code d'invitation avec ton ami :\n\n` +
        `👉 *${code}*\n\n` +
        `Ton ami doit envoyer ce code au bot pour rejoindre la partie.\n` +
        `Dès qu'il aura rejoint, le jeu commencera automatiquement !\n` +
        `_(Pour annuler et quitter, envoie *0* ou */retour*)_`,
    };
  }

  /**
   * MULTIJOUEUR : Joint une partie avec le code
   */
  async joinMultiplayerGame(
    inviteCode: string,
    player2ChatId: string,
  ): Promise<{ game: any; messagePlayer1: string; messagePlayer2: string } | null> {
    const game = await this.prisma.morpionGame.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
    });

    if (!game || game.status !== MorpionStatus.WAITING) {
      return null;
    }

    if (game.player1ChatId === player2ChatId) {
      return null; // On ne peut pas jouer contre soi-même
    }

    // Mise à jour de la partie
    const updatedGame = await this.prisma.morpionGame.update({
      where: { id: game.id },
      data: {
        player2ChatId,
        status: MorpionStatus.PLAYING,
        currentTurn: 1, // Le joueur 1 commence toujours
      },
    });

    // Mettre à jour la session du joueur 2
    await this.gameService.updateGameSessionWithData(player2ChatId, 'morpion', {
      mode: 'multi',
      gameId: game.id,
      role: 'player2',
    });

    const rendered = this.renderBoard('         ');

    const msg1 =
      `🎉 Un adversaire a rejoint ta partie ! 🥳\n` +
      `Tu es les *❌* et c'est *à ton tour* !\n` +
      `Envoie le numéro de la case où tu veux jouer (1 à 9).\n\n` +
      `${rendered}`;

    const msg2 =
      `🎉 Tu as rejoint la partie de Morpion ! 🥳\n` +
      `Tu es les *⭕*.\n` +
      `C'est au joueur 1 (❌) de commencer. Attends son coup...\n\n` +
      `${rendered}`;

    return {
      game: updatedGame,
      messagePlayer1: msg1,
      messagePlayer2: msg2,
    };
  }

  /**
   * MULTIJOUEUR : Joue un coup
   */
  async handleMultiplayerMove(
    chatId: string,
    input: string,
    gameId: string,
    role: 'player1' | 'player2',
  ): Promise<{
    success: boolean;
    message: string;
    shouldNotifyAdversary: boolean;
    adversaryChatId?: string;
    adversaryMessage?: string;
  }> {
    const game = await this.prisma.morpionGame.findUnique({
      where: { id: gameId },
    });

    if (!game || game.status !== MorpionStatus.PLAYING) {
      return {
        success: false,
        message: `⚠️ Cette partie n'est plus active ou n'existe pas.`,
        shouldNotifyAdversary: false,
      };
    }

    // Vérifier si c'est le tour de ce joueur
    const isPlayer1Turn = game.currentTurn === 1;
    const isThisPlayerTurn = (role === 'player1' && isPlayer1Turn) || (role === 'player2' && !isPlayer1Turn);

    if (!isThisPlayerTurn) {
      return {
        success: false,
        message: `⏳ Ce n'est pas ton tour ! Attends que ton adversaire ait joué.`,
        shouldNotifyAdversary: false,
      };
    }

    const position = parseInt(input.trim(), 10);
    if (isNaN(position) || position < 1 || position > 9) {
      return {
        success: false,
        message: `⚠️ Envoie un chiffre entre *1* et *9* pour jouer sur une case libre.`,
        shouldNotifyAdversary: false,
      };
    }

    const boardArray = game.board.split('');
    const index = position - 1;

    if (boardArray[index] !== ' ') {
      return {
        success: false,
        message: `⚠️ La case *${position}* est occupée ! Choisis-en une autre.`,
        shouldNotifyAdversary: false,
      };
    }

    // Appliquer le coup
    const symbol = role === 'player1' ? 'X' : 'O';
    boardArray[index] = symbol;
    const newBoard = boardArray.join('');

    const check = this.checkWinner(newBoard);
    const adversaryChatId = role === 'player1' ? game.player2ChatId! : game.player1ChatId;

    if (check.status === 'WIN') {
      // Fin de la partie - Victoire
      await this.prisma.morpionGame.update({
        where: { id: game.id },
        data: {
          board: newBoard,
          status: MorpionStatus.FINISHED,
          winnerId: chatId,
        },
      });

      // Libérer les sessions
      await this.gameService.updateGameSessionWithData(game.player1ChatId, null, null);
      await this.gameService.updateGameSessionWithData(game.player2ChatId!, null, null);

      return {
        success: true,
        message:
          `🏆 *VICTOIRE !* Tu as gagné la partie ! 🥳\n\n` +
          `${this.renderBoard(newBoard)}\n\n` +
          `_(Envoie *4* pour démarrer une nouvelle partie, ou *0* pour le menu principal)_`,
        shouldNotifyAdversary: true,
        adversaryChatId,
        adversaryMessage:
          `💀 *DÉFAITE !* Ton adversaire a gagné la partie. 🦾\n\n` +
          `${this.renderBoard(newBoard)}\n\n` +
          `_(Envoie *4* pour démarrer une nouvelle partie, ou *0* pour le menu principal)_`,
      };
    } else if (check.status === 'DRAW') {
      // Fin de la partie - Égalité
      await this.prisma.morpionGame.update({
        where: { id: game.id },
        data: {
          board: newBoard,
          status: MorpionStatus.FINISHED,
          winnerId: 'DRAW',
        },
      });

      // Libérer les sessions
      await this.gameService.updateGameSessionWithData(game.player1ChatId, null, null);
      await this.gameService.updateGameSessionWithData(game.player2ChatId!, null, null);

      const drawMsg =
        `🤝 *ÉGALITÉ !* Aucun vainqueur sur cette grille.\n\n` +
        `${this.renderBoard(newBoard)}\n\n` +
        `_(Envoie *4* pour lancer une nouvelle partie, ou *0* pour le menu principal)_`;

      return {
        success: true,
        message: drawMsg,
        shouldNotifyAdversary: true,
        adversaryChatId,
        adversaryMessage: drawMsg,
      };
    }

    // Toggle tour
    const nextTurn = game.currentTurn === 1 ? 2 : 1;
    await this.prisma.morpionGame.update({
      where: { id: game.id },
      data: {
        board: newBoard,
        currentTurn: nextTurn,
      },
    });

    const renderedBoard = this.renderBoard(newBoard);

    return {
      success: true,
      message:
        `✅ Coup enregistré en case *${position}*.\n` +
        `C'est le tour de ton adversaire. Attends son coup...\n\n` +
        `${renderedBoard}`,
      shouldNotifyAdversary: true,
      adversaryChatId,
      adversaryMessage:
        `🔔 Ton adversaire a joué en case *${position}* (symbolisé par *${symbol}*).\n` +
        `👉 *C'est à ton tour* ! Joue en envoyant le chiffre de la case libre.\n\n` +
        `${renderedBoard}`,
    };
  }

  /**
   * Détermine le coup du bot
   */
  private getBotMove(board: string[], difficulty: 'EASY' | 'HARD'): number {
    const emptyIndices: number[] = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === ' ') emptyIndices.push(i);
    }

    if (emptyIndices.length === 0) return -1;

    // Mode FACILE : coup aléatoire
    if (difficulty === 'EASY') {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    // Mode DIFFICILE : Minimax
    let bestVal = -1000;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (board[i] === ' ') {
        board[i] = 'O'; // Bot joue O
        const moveVal = this.minimax(board, 0, false);
        board[i] = ' '; // backtrack
        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }

    return bestMove !== -1 ? bestMove : emptyIndices[0];
  }

  /**
   * Algorithme Minimax
   */
  private minimax(board: string[], depth: number, isMax: boolean): number {
    const score = this.evaluateBoard(board);

    // Bot gagne (O)
    if (score === 10) return score - depth;
    // Joueur gagne (X)
    if (score === -10) return score + depth;
    // Match nul
    if (!board.includes(' ')) return 0;

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') {
          board[i] = 'O';
          best = Math.max(best, this.minimax(board, depth + 1, false));
          board[i] = ' ';
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') {
          board[i] = 'X';
          best = Math.min(best, this.minimax(board, depth + 1, true));
          board[i] = ' ';
        }
      }
      return best;
    }
  }

  /**
   * Évalue le plateau pour Minimax
   * @returns 10 si O gagne, -10 si X gagne, 0 sinon
   */
  private evaluateBoard(board: string[]): number {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Lignes
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Colonnes
      [0, 4, 8],
      [2, 4, 6], // Diagonales
    ];

    for (const combo of winCombos) {
      if (board[combo[0]] !== ' ' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        return board[combo[0]] === 'O' ? 10 : -10;
      }
    }

    return 0;
  }

  /**
   * Vérifie si un joueur a gagné ou s'il y a égalité
   */
  checkWinner(board: string): { status: 'PLAYING' | 'WIN' | 'DRAW'; winner?: string } {
    const b = board.split('');
    const score = this.evaluateBoard(b);

    if (score === 10) return { status: 'WIN', winner: 'O' };
    if (score === -10) return { status: 'WIN', winner: 'X' };
    if (!b.includes(' ')) return { status: 'DRAW' };

    return { status: 'PLAYING' };
  }

  /**
   * Formate et dessine la grille avec des emojis premium
   */
  renderBoard(board: string): string {
    const b = board.split('');
    const numEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

    const cell = (idx: number) => {
      if (b[idx] === 'X') return '❌';
      if (b[idx] === 'O') return '⭕';
      return numEmojis[idx];
    };

    return (
      ` ${cell(0)} | ${cell(1)} | ${cell(2)} \n` +
      `----------- \n` +
      ` ${cell(3)} | ${cell(4)} | ${cell(5)} \n` +
      `----------- \n` +
      ` ${cell(6)} | ${cell(7)} | ${cell(8)} `
    );
  }
}
