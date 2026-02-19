/**
 * Game Repository Implementation
 * Handles internal API calls for game data (proxied to RAWG on server)
 */

import { IGameRepository } from "./game.repository.interface";
import { Game, GameDetail, GameFilters, GameGenre, GamePlatform } from "@/domain/game/game.model";
import { HttpClient } from "@/infrastructure/http/http-client";
import { GameMapper } from "@/infrastructure/mappers/game.mapper";
import {
  RawgGamesResponse,
  RawgGameDetailResponse,
  RawgGenresResponse,
  RawgPlatformsResponse,
} from "@/types/api/rawg.types";

export class GameRepository implements IGameRepository {
  constructor(private httpClient: HttpClient) {}

  async getGames(
    filters?: GameFilters
  ): Promise<{ items: Game[]; total: number; next: string | null }> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.genres) params.append("genres", filters.genres);
    if (filters?.platforms) params.append("platforms", filters.platforms);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.pageSize) params.append("page_size", filters.pageSize.toString());
    if (filters?.ordering) params.append("ordering", filters.ordering);
    if (filters?.dates) params.append("dates", filters.dates);
    if (filters?.metacritic) params.append("metacritic", filters.metacritic);

    const response = await this.httpClient.get<RawgGamesResponse>(`/games?${params.toString()}`);

    return {
      ...GameMapper.toPaginatedDomain(response),
      next: response.next,
    };
  }

  async getGameById(id: number | string): Promise<GameDetail> {
    const response = await this.httpClient.get<RawgGameDetailResponse>(`/games/${id}`);
    return GameMapper.toDetailDomain(response);
  }

  async getGenres(): Promise<GameGenre[]> {
    const response = await this.httpClient.get<RawgGenresResponse>(`/games/genres`);

    return response.results.map((genre) => ({
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
    }));
  }

  async getPlatforms(): Promise<GamePlatform[]> {
    const response = await this.httpClient.get<RawgPlatformsResponse>(`/games/platforms`);

    return response.results.map((platform) => ({
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
    }));
  }
}
