/**
 * RAWG API Response Types
 * These represent the actual API response structure (different from domain models)
 */

export interface RawgGameResponse {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Array<{
    id: number;
    title: string;
    count: number;
    percent: number;
  }>;
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
  };
  metacritic: number | null;
  playtime: number;
  suggestions_count: number;
  updated: string;
  user_game: null;
  reviews_count: number;
  saturated_color: string;
  dominant_color: string;
  platforms: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
      image: null;
      year_end: null;
      year_start: null;
      games_count: number;
      image_background: string;
    };
    released_at: string;
    requirements_en: null | {
      minimum: string;
      recommended: string;
    };
    requirements_ru: null;
  }>;
  parent_platforms: Array<{
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }>;
  genres: Array<{
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }>;
  stores: Array<{
    id: number;
    store: {
      id: number;
      name: string;
      slug: string;
      domain: string;
      games_count: number;
      image_background: string;
    };
  }>;
  clip: null;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
  }>;
  esrb_rating: {
    id: number;
    name: string;
    slug: string;
  } | null;
  short_screenshots: Array<{
    id: number;
    image: string;
  }>;
}

export interface RawgGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGameResponse[];
}

export interface RawgGameDetailResponse extends Omit<RawgGameResponse, "reviews_text_count"> {
  description: string;
  description_raw: string;
  metacritic_platforms: Array<{
    metascore: number;
    url: string;
    platform: {
      platform: number;
      name: string;
      slug: string;
    };
  }>;
  website: string;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_text_count: string;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  developers: Array<{
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }>;
  publishers: Array<{
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
  }>;
  achievements_count: number;
}

export interface RawgGenreResponse {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface RawgGenresResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGenreResponse[];
}

export interface RawgPlatformResponse {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
  image: string | null;
  year_start: number | null;
  year_end: number | null;
}

export interface RawgPlatformsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgPlatformResponse[];
}
