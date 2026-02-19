/**
 * Game Repository Interface
 * Defines contract for game data operations (RAWG API)
 */

import { Game, GameDetail, GameFilters, GameGenre, GamePlatform } from "@/domain/game/game.model";

export interface IGameRepository {
  /**
   * Retrieves games list with optional filters
   */
  getGames(filters?: GameFilters): Promise<{ items: Game[]; total: number; next: string | null }>;

  /**
   * Retrieves single game by ID or slug
   */
  getGameById(id: number | string): Promise<GameDetail>;

  /**
   * Retrieves available genres
   */
  getGenres(): Promise<GameGenre[]>;

  /**
   * Retrieves available platforms
   */
  getPlatforms(): Promise<GamePlatform[]>;
}
