/**
 * Game Service
 * Business logic layer for game operations (RAWG API)
 * Depends on IGameRepository abstraction (Dependency Inversion)
 */

import { IGameRepository } from "@/infrastructure/repositories/game.repository.interface";
import { Game, GameDetail, GameFilters, GameGenre, GamePlatform } from "@/domain/game/game.model";

export class GameService {
  constructor(private repository: IGameRepository) {}

  /**
   * Retrieves paginated games with optional filtering and sorting
   */
  async getGames(
    filters?: GameFilters
  ): Promise<{ items: Game[]; total: number; next: string | null }> {
    return this.repository.getGames(filters);
  }

  /**
   * Retrieves detailed game information by ID or slug
   */
  async getGameById(id: number | string): Promise<GameDetail> {
    return this.repository.getGameById(id);
  }

  /**
   * Retrieves all available genres
   */
  async getGenres(): Promise<GameGenre[]> {
    return this.repository.getGenres();
  }

  /**
   * Retrieves all available platforms
   */
  async getPlatforms(): Promise<GamePlatform[]> {
    return this.repository.getPlatforms();
  }

  /**
   * Builds ordering string based on sort field and direction
   */
  buildOrderingString(field: string, direction: "asc" | "desc"): string {
    return direction === "desc" ? `-${field}` : field;
  }
}
