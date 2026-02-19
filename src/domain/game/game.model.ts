/**
 * Game domain model
 * Game entity from RAWG API
 */
export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  backgroundImage: string;
  rating: number;
  ratingTop: number;
  ratingsCount: number;
  metacritic: number | null;
  playtime: number;
  platforms: GamePlatform[];
  genres: GameGenre[];
  tags: GameTag[];
  esrbRating: EsrbRating | null;
  shortScreenshots: Screenshot[];
}

export interface GamePlatform {
  id: number;
  name: string;
  slug: string;
}

export interface GameGenre {
  id: number;
  name: string;
  slug: string;
}

export interface GameTag {
  id: number;
  name: string;
  slug: string;
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

/**
 * Detailed game information
 */
export interface GameDetail extends Game {
  description: string;
  descriptionRaw: string;
  website: string;
  redditUrl: string;
  developers: Developer[];
  publishers: Publisher[];
  achievements: Achievement[];
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  image: string;
  percent: string;
}

/**
 * Game query filters
 */
export interface GameFilters {
  search?: string;
  genres?: string;
  platforms?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  dates?: string;
  metacritic?: string;
}
