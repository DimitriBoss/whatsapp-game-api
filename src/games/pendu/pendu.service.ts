import { Injectable } from '@nestjs/common';
import { GameService } from '../../game/game.service';
import { BotState } from '@prisma/client';

interface PenduState {
  word: string; // Le mot secret en minuscule sans accents
  originalWord: string; // Le mot secret tel qu'affiché (avec accents ou majuscules si besoin)
  guessedLetters: string[]; // Lettres déjà essayées
  errors: number; // Nombre d'erreurs (max 7)
}

@Injectable()
export class PenduService {
  constructor(private gameService: GameService) {}

  // Liste de 100+ mots liés à la culture béninoise et africaine
  private readonly WORDS = [
    { secret: 'cotonou', display: 'Cotonou' },
    { secret: 'portonovo', display: 'Porto-Novo' },
    { secret: 'parakou', display: 'Parakou' },
    { secret: 'djougou', display: 'Djougou' },
    { secret: 'bohuecon', display: 'Bohicon' },
    { secret: 'abomey', display: 'Abomey' },
    { secret: 'natitingou', display: 'Natitingou' },
    { secret: 'kandi', display: 'Kandi' },
    { secret: 'lokossa', display: 'Lokossa' },
    { secret: 'ouidah', display: 'Ouidah' },
    { secret: 'dogbo', display: 'Dogbo' },
    { secret: 'malanville', display: 'Malanville' },
    { secret: 'dassa', display: 'Dassa' },
    { secret: 'savalou', display: 'Savalou' },
    { secret: 'allada', display: 'Allada' },
    { secret: 'tanguieta', display: 'Tanguiéta' },
    { secret: 'banikoara', display: 'Banikoara' },
    { secret: 'nikki', display: 'Nikki' },
    { secret: 'ketou', display: 'Kétou' },
    { secret: 'pobe', display: 'Pobè' },
    { secret: 'tchaourou', display: 'Tchaourou' },
    { secret: 'grandpopo', display: 'Grand-Popo' },
    { secret: 'ganvie', display: 'Ganvié' },
    { secret: 'dahomey', display: 'Dahomey' },
    { secret: 'pendjari', display: 'Pendjari' },
    { secret: 'somba', display: 'Somba' },
    { secret: 'tatasomba', display: 'Tata Somba' },
    { secret: 'agbadja', display: 'Agbadja' },
    { secret: 'zangbeto', display: 'Zangbéto' },
    { secret: 'voodoo', display: 'Vaudou' },
    { secret: 'egoungoun', display: 'Egoungoun' },
    { secret: 'fon', display: 'Fon' },
    { secret: 'yoruba', display: 'Yoruba' },
    { secret: 'adja', display: 'Adja' },
    { secret: 'bariba', display: 'Bariba' },
    { secret: 'dendi', display: 'Dendi' },
    { secret: 'peul', display: 'Peul' },
    { secret: 'ditamari', display: 'Ditamari' },
    { secret: 'nago', display: 'Nago' },
    { secret: 'wama', display: 'Wama' },
    { secret: 'goun', display: 'Goun' },
    { secret: 'mina', display: 'Mina' },
    { secret: 'ewe', display: 'Ewe' },
    { secret: 'igname', display: 'Igname' },
    { secret: 'manioc', display: 'Manioc' },
    { secret: 'garri', display: 'Garri' },
    { secret: 'akassa', display: 'Akassa' },
    { secret: 'amiwo', display: 'Amiwo' },
    { secret: 'wassa', display: 'Wassa-wassa' },
    { secret: 'tchoukoutou', display: 'Tchoukoutou' },
    { secret: 'sodabi', display: 'Sodabi' },
    { secret: 'atieke', display: 'Attiéké' },
    { secret: 'aloko', display: 'Alloco' },
    { secret: 'mamba', display: 'Mamba' },
    { secret: 'lion', display: 'Lion' },
    { secret: 'elephant', display: 'Éléphant' },
    { secret: 'buffle', display: 'Buffle' },
    { secret: 'hippopotame', display: 'Hippopotame' },
    { secret: 'singe', display: 'Singe' },
    { secret: 'guepard', display: 'Guépard' },
    { secret: 'python', display: 'Python' },
    { secret: 'cameleon', display: 'Caméléon' },
    { secret: 'baobab', display: 'Baobab' },
    { secret: 'iroko', display: 'Iroko' },
    { secret: 'palmiste', display: 'Palmiste' },
    { secret: 'ananas', display: 'Ananas' },
    { secret: 'mangue', display: 'Mangue' },
    { secret: 'papaye', display: 'Papaye' },
    { secret: 'karite', display: 'Karité' },
    { secret: 'cacao', display: 'Cacao' },
    { secret: 'tissage', display: 'Tissage' },
    { secret: 'pagne', display: 'Pagne' },
    { secret: 'kanvo', display: 'Kanvo' },
    { secret: 'calebasse', display: 'Calebasse' },
    { secret: 'tamtam', display: 'Tam-tam' },
    { secret: 'balafon', display: 'Balafon' },
    { secret: 'kora', display: 'Kora' },
    { secret: 'maracas', display: 'Maracas' },
    { secret: 'perle', display: 'Perle' },
    { secret: 'cauris', display: 'Cauris' },
    { secret: 'royaume', display: 'Royaume' },
    { secret: 'behanzin', display: 'Béhanzin' },
    { secret: 'toffa', display: 'Toffa' },
    { secret: 'guezo', display: 'Guézo' },
    { secret: 'bioguera', display: 'Bio Guéra' },
    { secret: 'kaba', display: 'Kaba' },
    { secret: 'gbewassana', display: 'Gbéwassana' },
    { secret: 'amazone', display: 'Amazone' },
    { secret: 'minon', display: 'Minon' },
    { secret: 'agoo', display: 'Agoo' },
    { secret: 'calavi', display: 'Calavi' },
    { secret: 'akpakpa', display: 'Akpakpa' },
    { secret: 'fidjrosse', display: 'Fidjrossè' },
    { secret: 'tokpa', display: 'Tokpa' },
    { secret: 'dantokpa', display: 'Dantokpa' },
    { secret: 'cadjehoun', display: 'Cadjehoun' },
    { secret: 'jonquet', display: 'Jonquet' },
    { secret: 'ganhi', display: 'Ganhi' },
    { secret: 'kouaba', display: 'Kouaba' },
    { secret: 'boukombe', display: 'Boukombé' },
    { secret: 'parafitte', display: 'Parafitte' },
  ];

  /**
   * Démarre une partie de Pendu
   */
  async startGame(chatId: string): Promise<string> {
    const randomObj = this.WORDS[Math.floor(Math.random() * this.WORDS.length)];
    const state: PenduState = {
      word: randomObj.secret,
      originalWord: randomObj.display,
      guessedLetters: [],
      errors: 0,
    };

    await this.gameService.updateGameSessionWithData(chatId, 'pendu', state);

    return (
      `🌳 *JEU DU PENDU* 🌳\n\n` +
      `Devine le mot caché en proposant des lettres une par une.\n` +
      `Le mot fait partie de la culture, de la géographie ou des traditions béninoises/africaines.\n\n` +
      `Mot à deviner :\n` +
      `*${this.renderWord(state.word, state.guessedLetters)}*\n\n` +
      `Propose une lettre (ex: *r: a ou r a*) ou devine le mot complet !\n` +
      `_(Pour quitter, envoie *0* ou */retour*)_`
    );
  }

  /**
   * Traite une proposition (lettre ou mot)
   */
  async handleGuess(
    sessionKey: string,
    senderNumber: string,
    input: string,
    currentData: any,
  ): Promise<string> {
    if (!currentData || !currentData.word) {
      return await this.startGame(sessionKey);
    }

    const state = currentData as PenduState;
    const cleanInput = this.normalizeInput(input);

    if (cleanInput.length === 0) {
      return `⚠️ Envoie une lettre valide ou un mot complet.`;
    }

    // Cas 1 : Tentative de mot complet
    if (cleanInput.length > 1) {
      // Ignorer si la longueur ne correspond pas, sans infliger de pénalité
      if (cleanInput.length !== state.word.length) {
        return (
          `⚠️ Mauvaise longueur ! Le mot à deviner fait *${state.word.length}* lettres.\n` +
          `Ton entrée (*${input}*) a été ignorée pour ne pas te pénaliser.\n\n` +
          `Mot :\n` +
          `*${this.renderWord(state.word, state.guessedLetters)}*\n\n` +
          `Lettres essayées : ${state.guessedLetters.join(', ') || 'aucune'}\n` +
          `Erreurs : *${state.errors}/7*`
        );
      }

      if (cleanInput === state.word) {
        // Victoire !
        await this.gameService.updateGameSessionWithData(
          sessionKey,
          null,
          null,
        );
        await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
        const newPoints = await this.gameService.incrementUserPoints(
          senderNumber,
          15,
        );
        return (
          `🎉 *FÉLICITATIONS !* Tu as trouvé le mot caché ! 🥳\n` +
          `Le mot était bien : *${state.originalWord}*.\n` +
          `🏆 Tu gagnes *+15 points* ! (Total : *${newPoints}* pts)\n\n` +
          `_(Envoie *3* pour rejouer au Pendu, ou *0* pour retourner au menu principal)_`
        );
      } else {
        // Mauvaise tentative de mot complet -> pénalité de 2 erreurs
        state.errors += 2;
        if (state.errors >= 7) {
          state.errors = 7;
          await this.gameService.updateGameSessionWithData(
            sessionKey,
            null,
            null,
          );
          await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
          return (
            `💀 *PENDU !* Le mot secret était : *${state.originalWord}*.\n\n` +
            `${this.renderHangman(7)}\n\n` +
            `Tu as épuisé tes tentatives.\n` +
            `_(Envoie *3* pour rejouer au Pendu, ou *0* pour le menu)_`
          );
        }

        await this.gameService.updateGameSessionWithData(
          sessionKey,
          'pendu',
          state,
        );
        return (
          `❌ Ce n'est pas le mot *${input}* ! (+2 erreurs)\n\n` +
          `${this.renderHangman(state.errors)}\n\n` +
          `Mot :\n` +
          `*${this.renderWord(state.word, state.guessedLetters)}*\n\n` +
          `Lettres essayées : ${state.guessedLetters.join(', ') || 'aucune'}\n` +
          `Erreurs : *${state.errors}/7*`
        );
      }
    }

    // Cas 2 : Une seule lettre
    const letter = cleanInput;

    if (state.guessedLetters.includes(letter)) {
      return (
        `💡 Tu as déjà essayé la lettre *${letter.toUpperCase()}*.\n\n` +
        `Mot : *${this.renderWord(state.word, state.guessedLetters)}*\n` +
        `Lettres essayées : ${state.guessedLetters.join(', ')}`
      );
    }

    state.guessedLetters.push(letter);

    const isCorrect = state.word.includes(letter);
    if (isCorrect) {
      // Vérifier si gagné
      const isWon = state.word.split('').every((char) => {
        return (
          state.guessedLetters.includes(char) || char === '-' || char === ' '
        );
      });

      if (isWon) {
        await this.gameService.updateGameSessionWithData(
          sessionKey,
          null,
          null,
        );
        await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
        const newPoints = await this.gameService.incrementUserPoints(
          senderNumber,
          15,
        );
        return (
          `🎉 *VICTOIRE !* Tu as trouvé le mot caché ! 🥳\n` +
          `Le mot était : *${state.originalWord}*.\n` +
          `🏆 Tu gagnes *+15 points* ! (Total : *${newPoints}* pts)\n\n` +
          `_(Envoie *3* pour rejouer au Pendu, ou *0* pour le menu principal)_`
        );
      }

      await this.gameService.updateGameSessionWithData(
        sessionKey,
        'pendu',
        state,
      );
      return (
        `✅ Bonne lettre ! La lettre *${letter.toUpperCase()}* est dans le mot.\n\n` +
        `Mot :\n` +
        `*${this.renderWord(state.word, state.guessedLetters)}*\n\n` +
        `Lettres essayées : ${state.guessedLetters.join(', ')}\n` +
        `Erreurs : *${state.errors}/7*`
      );
    } else {
      state.errors += 1;
      if (state.errors >= 7) {
        await this.gameService.updateGameSessionWithData(
          sessionKey,
          null,
          null,
        );
        await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
        return (
          `💀 *PENDU !* Tu as perdu.\n` +
          `Le mot secret était : *${state.originalWord}*.\n\n` +
          `${this.renderHangman(7)}\n\n` +
          `_(Envoie *3* pour rejouer au Pendu, ou *0* pour le menu principal)_`
        );
      }

      await this.gameService.updateGameSessionWithData(
        sessionKey,
        'pendu',
        state,
      );
      return (
        `❌ Mauvaise pioche ! La lettre *${letter.toUpperCase()}* n'est pas dans le mot.\n\n` +
        `${this.renderHangman(state.errors)}\n\n` +
        `Mot :\n` +
        `*${this.renderWord(state.word, state.guessedLetters)}*\n\n` +
        `Lettres essayées : ${state.guessedLetters.join(', ')}\n` +
        `Erreurs : *${state.errors}/7*`
      );
    }
  }

  private normalizeInput(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, '')
      .trim();
  }

  private renderWord(word: string, guessedLetters: string[]): string {
    return word
      .split('')
      .map((char) => {
        if (char === ' ' || char === '-') return char;
        return guessedLetters.includes(char) ? char.toUpperCase() : '_';
      })
      .join(' ');
  }

  private renderHangman(errors: number): string {
    const stages = [
      `\n\n\n\n=========`, // 0
      `      |\n      |\n      |\n      |\n      |\n=========`, // 1
      `  +---+\n      |\n      |\n      |\n      |\n      |\n=========`, // 2
      `  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========`, // 3
      `  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========`, // 4
      `  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========`, // 5
      `  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========`, // 6
      `  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========`, // 7
    ];
    return `\`\`\`\n${stages[errors] || stages[0]}\n\`\`\``;
  }
}
