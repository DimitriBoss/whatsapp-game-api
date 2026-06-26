import { Injectable } from '@nestjs/common';
import { GameService } from '../../game/game.service';
import { BotState } from '@prisma/client';

interface EmojiChallenge {
  emojis: string;
  answers: string[]; // Réponses acceptées (normalisées et brutes)
  displayAnswer: string; // La réponse affichée à la fin
  hint: string; // Indice si l'utilisateur se trompe
}

interface EmojiState {
  challengeIndex: number;
  attempts: number;
}

@Injectable()
export class EmojiService {
  constructor(private gameService: GameService) {}

  // 30+ défis emoji
  private readonly CHALLENGES: EmojiChallenge[] = [
    { emojis: '🎬🦁👑', answers: ['le roi lion', 'roi lion'], displayAnswer: 'Le Roi Lion', hint: 'Un grand classique d\'animation Disney sur la savane africaine.' },
    { emojis: '🚢❄️💔', answers: ['titanic'], displayAnswer: 'Titanic', hint: 'Un bateau réputé insubmersible qui heurte un iceberg.' },
    { emojis: '⚡🧙‍♂️👓', answers: ['harry potter'], displayAnswer: 'Harry Potter', hint: 'Un jeune sorcier à lunettes qui combat celui dont on ne doit pas prononcer le nom.' },
    { emojis: '🕷️👦🕸️', answers: ['spiderman', 'spider man', 'l\'homme araignee'], displayAnswer: 'Spider-Man', hint: 'Un super-héros mordu par une araignée radioactive.' },
    { emojis: '🦖🦕🌋', answers: ['jurassic park', 'jurassic world'], displayAnswer: 'Jurassic Park', hint: 'Un parc d\'attractions avec des dinosaures clonés qui s\'échappent.' },
    { emojis: '🦇🧔🏙️', answers: ['batman', 'chevalier noir'], displayAnswer: 'Batman', hint: 'Le protecteur de Gotham City habillé en chauve-souris.' },
    { emojis: '🎪🦁🐘', answers: ['dumbo', 'le cirque', 'cirque'], displayAnswer: 'Dumbo ou Le Cirque', hint: 'Un spectacle ambulant avec des clowns et des animaux.' },
    { emojis: '🍫🏭🏭', answers: ['charlie et la chocolaterie', 'charlie et la chocolatrie'], displayAnswer: 'Charlie et la Chocolaterie', hint: 'Cinq tickets d\'or pour visiter l\'usine de Willy Wonka.' },
    { emojis: '🍎🧙‍♀️👑', answers: ['blanche neige', 'blanche-neige'], displayAnswer: 'Blanche-Neige', hint: 'Une princesse, une pomme empoisonnée et sept nains.' },
    { emojis: '🧜‍♀️🌊🐚', answers: ['la petite sirene', 'petite sirene'], displayAnswer: 'La Petite Sirène', hint: 'Ariel veut vivre sur la terre ferme avec les humains.' },
    { emojis: '❄️👑⛄', answers: ['la reine des neiges', 'reine des neiges'], displayAnswer: 'La Reine des Neiges', hint: 'Libérée, délivrée... sauras-tu retrouver le titre ?' },
    { emojis: '🤡🎈🩸', answers: ['ca', 'it', 'le clown'], displayAnswer: 'Ça (It)', hint: 'Un clown terrifiant créé par Stephen King dans la ville de Derry.' },
    { emojis: '🧀🐭🍷', answers: ['ratatouille'], displayAnswer: 'Ratatouille', hint: 'Rémy, un rat qui adore cuisiner à Paris.' },
    { emojis: '🥊⚡🏆', answers: ['rocky'], displayAnswer: 'Rocky', hint: 'Un boxeur de Philadelphie incarné par Sylvester Stallone.' },
    { emojis: '🐒🍌🌴', answers: ['tarzan', 'le livre de la jungle'], displayAnswer: 'Tarzan', hint: 'Un homme élevé par des singes dans la jungle.' },
    { emojis: '🦊🐰👮', answers: ['zootopie'], displayAnswer: 'Zootopie', hint: 'Une lapine policière fait équipe avec un renard rusé.' },
    { emojis: '🚗💨🏁', answers: ['cars', 'cars quatre roues'], displayAnswer: 'Cars', hint: 'Flash McQueen, une voiture de course rouge.' },
    { emojis: '👴🏠🎈', answers: ['la-haut', 'la haut', 'up'], displayAnswer: 'Là-haut', hint: 'Un vieux monsieur s\'envole avec sa maison grâce à des ballons.' },
    { emojis: '🏹💚🌲', answers: ['robin des bois', 'robin du bois'], displayAnswer: 'Robin des Bois', hint: 'Il vole aux riches pour donner aux pauvres dans la forêt de Sherwood.' },
    { emojis: '🧸🤠👩', answers: ['toy story'], displayAnswer: 'Toy Story', hint: 'Des jouets qui prennent vie quand les humains ne regardent pas.' },
    { emojis: '🐼🥊🥢', answers: ['kung fu panda'], displayAnswer: 'Kung Fu Panda', hint: 'Po, un panda maladroit qui devient le Guerrier Dragon.' },
    { emojis: '👑🐉⚔️', answers: ['game of thrones', 'got', 'le trone de fer'], displayAnswer: 'Game of Thrones', hint: 'Une série avec des familles nobles, des dragons et un trône de fer.' },
    { emojis: '💍🌋🧝', answers: ['le seigneur des anneaux', 'seigneur des anneaux'], displayAnswer: 'Le Seigneur des Anneaux', hint: 'Frodon doit détruire un anneau unique dans la montagne du Destin.' },
    { emojis: '⚔️🌌🚀', answers: ['star wars', 'la guerre des etoiles'], displayAnswer: 'Star Wars', hint: 'Que la Force soit avec toi...' },
    { emojis: '🕵️‍♂️🔎🇬🇧', answers: ['sherlock holmes', 'sherlock'], displayAnswer: 'Sherlock Holmes', hint: 'Le plus célèbre détective privé britannique vivant au 221B Baker Street.' },
    { emojis: '🎸⚡🚗', answers: ['retour vers le futur'], displayAnswer: 'Retour vers le futur', hint: 'Marty McFly voyage dans le temps avec une DeLorean.' },
    { emojis: '👻🚫🏰', answers: ['ghostbusters', 'sos fantomes', 'sos fantômes'], displayAnswer: 'Ghostbusters (S.O.S. Fantômes)', hint: 'Qui vas-tu appeler si des esprits envahissent ta maison ?' },
    { emojis: '🍕🐢🥋', answers: ['tortues ninja', 'les tortues ninja'], displayAnswer: 'Les Tortues Ninja', hint: 'Quatre tortues mutantes nommées d\'après des artistes de la Renaissance italienne.' },
    { emojis: '🐒👑🏢', answers: ['king kong'], displayAnswer: 'King Kong', hint: 'Un gorille géant au sommet de l\'Empire State Building.' },
    { emojis: '🟢👹🧅', answers: ['shrek'], displayAnswer: 'Shrek', hint: 'Un ogre vert qui vit dans un marécage et adore les oignons.' },
    { emojis: '🧙‍♂️🧹🧹', answers: ['harry potter'], displayAnswer: 'Harry Potter', hint: 'Des sorciers qui volent sur des balais et jouent au Quidditch.' },
  ];

  /**
   * Démarre une partie
   */
  async startGame(chatId: string): Promise<string> {
    const idx = Math.floor(Math.random() * this.CHALLENGES.length);
    const state: EmojiState = {
      challengeIndex: idx,
      attempts: 0,
    };

    await this.gameService.updateGameSessionWithData(chatId, 'emoji', state);

    return (
      `🎬 *MATCH EMOJI (Devine le film)* 🎬\n\n` +
      `Quel film ou série se cache derrière ces emojis ?\n` +
      `👉   *${this.CHALLENGES[idx].emojis}*\n\n` +
      `Envoie ta réponse !\n` +
      `_(Tu as 3 tentatives. Pour quitter, envoie *0* ou */retour*)_`
    );
  }

  /**
   * Traite une proposition de l'utilisateur
   */
  async handleGuess(sessionKey: string, senderNumber: string, input: string, currentData: any): Promise<string> {
    if (!currentData || currentData.challengeIndex === undefined) {
      return await this.startGame(sessionKey);
    }

    const state = currentData as EmojiState;
    const challenge = this.CHALLENGES[state.challengeIndex];
    const normalizedInput = this.normalizeText(input);

    const isCorrect = challenge.answers.some(
      (ans) => this.normalizeText(ans) === normalizedInput,
    );

    if (isCorrect) {
      // Victoire !
      await this.gameService.updateGameSessionWithData(sessionKey, null, null);
      await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
      await this.gameService.incrementPlayedCount(senderNumber);
      const newPoints = await this.gameService.incrementUserPoints(senderNumber, 10);

      return (
        `🎉 *FÉLICITATIONS !* C'est la bonne réponse ! 🥳\n` +
        `Il s'agissait bien de : *${challenge.displayAnswer}*.\n` +
        `🏆 Tu gagnes *+10 points* ! (Total : *${newPoints}* pts)\n\n` +
        `_(Envoie *6* pour rejouer à Match Emoji, ou *0* pour le menu principal)_`
      );
    } else {
      state.attempts++;
      if (state.attempts >= 3) {
        // Défaite
        await this.gameService.updateGameSessionWithData(sessionKey, null, null);
        await this.gameService.updateUserState(senderNumber, BotState.MAIN_MENU);
        return (
          `❌ *Dommage !* C'était ta dernière tentative.\n` +
          `La bonne réponse était : *${challenge.displayAnswer}*.\n\n` +
          `_(Envoie *6* pour rejouer à Match Emoji, ou *0* pour le menu principal)_`
        );
      }

      // Sauvegarder l'état et proposer un indice
      await this.gameService.updateGameSessionWithData(sessionKey, 'emoji', state);
      const remaining = 3 - state.attempts;

      return (
        `❌ *Mauvaise réponse !*\n` +
        `Il te reste *${remaining}* tentative${remaining > 1 ? 's' : ''}.\n` +
        `💡 *Indice* : ${challenge.hint}\n\n` +
        `Réessaie : *${challenge.emojis}*`
      );
    }
  }

  private normalizeText(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }
}
