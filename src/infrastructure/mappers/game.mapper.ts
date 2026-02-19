/**
 * Game Mapper
 * Adapts RAWG API responses to Game domain models
 * Implements Adapter pattern for API → Domain transformation
 */

import { Game, GameDetail } from "@/domain/game/game.model";
import { RawgGameResponse, RawgGameDetailResponse } from "@/types/api/rawg.types";

export class GameMapper {
  /**
   * Maps RAWG game response to Game domain model
   */
  static toDomain(response: RawgGameResponse): Game {
    return {
      id: response.id,
      slug: response.slug,
      name: response.name,
      released: response.released,
      backgroundImage: response.background_image,
      rating: response.rating,
      ratingTop: response.rating_top,
      ratingsCount: response.ratings_count,
      metacritic: response.metacritic,
      playtime: response.playtime,
      platforms: (response.platforms || []).map((p) => ({
        id: p.platform.id,
        name: p.platform.name,
        slug: p.platform.slug,
      })),
      genres: (response.genres || []).map((g) => ({
        id: g.id,
        name: g.name,
        slug: g.slug,
      })),
      tags: (response.tags || []).slice(0, 5).map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
      esrbRating: response.esrb_rating
        ? {
            id: response.esrb_rating.id,
            name: response.esrb_rating.name,
            slug: response.esrb_rating.slug,
          }
        : null,
      shortScreenshots: (response.short_screenshots || []).map((s) => ({
        id: s.id,
        image: s.image,
      })),
    };
  }

  /**
   * Maps RAWG game detail response to GameDetail domain model
   */
  static toDetailDomain(response: RawgGameDetailResponse): GameDetail {
    // Cast to base type since detail response extends base (with Omit for type safety)
    const baseGame = this.toDomain(response as unknown as RawgGameResponse);

    return {
      ...baseGame,
      description: response.description,
      descriptionRaw: response.description_raw,
      website: response.website,
      redditUrl: response.reddit_url,
      developers: (response.developers || []).map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
      })),
      publishers: (response.publishers || []).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
      })),
      achievements: [],
    };
  }

  /**
   * Maps paginated RAWG games response
   */
  static toPaginatedDomain(response: { results: RawgGameResponse[]; count: number }): {
    items: Game[];
    total: number;
  } {
    return {
      items: response.results.map((game) => this.toDomain(game)),
      total: response.count,
    };
  }
}
