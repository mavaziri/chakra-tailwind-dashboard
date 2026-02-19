/**
 * Games React Query Hooks
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Game, GameDetail, GameFilters, GameGenre, GamePlatform } from "@/domain/game/game.model";
import { ServiceFactory } from "@/services/service.factory";
import { queryKeys } from "@/lib/react-query";

export function useGames(
  filters?: GameFilters
): UseQueryResult<{ items: Game[]; total: number; next: string | null }> {
  const gameService = ServiceFactory.getGameService();

  return useQuery({
    queryKey: queryKeys.games.list(filters),
    queryFn: () => gameService.getGames(filters),
  });
}

export function useGame(id: number | string): UseQueryResult<GameDetail> {
  const gameService = ServiceFactory.getGameService();

  return useQuery({
    queryKey: queryKeys.games.detail(id),
    queryFn: () => gameService.getGameById(id),
    enabled: !!id,
  });
}

export function useGenres(): UseQueryResult<GameGenre[]> {
  const gameService = ServiceFactory.getGameService();

  return useQuery({
    queryKey: queryKeys.games.genres,
    queryFn: () => gameService.getGenres(),
  });
}

export function usePlatforms(): UseQueryResult<GamePlatform[]> {
  const gameService = ServiceFactory.getGameService();

  return useQuery({
    queryKey: queryKeys.games.platforms,
    queryFn: () => gameService.getPlatforms(),
  });
}
