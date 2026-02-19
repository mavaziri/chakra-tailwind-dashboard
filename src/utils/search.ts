/**
 * Search Utility Functions
 * Provides relevance scoring for third-party API results
 */

/**
 * Calculates relevance score for a game based on search query
 * Higher score = better match
 *
 * Scoring logic:
 * - Exact match: 100
 * - Starts with (case-insensitive): 80
 * - Contains all words: 60
 * - Contains most words: 40
 * - Contains some words: 20
 * - No match: 0
 */
export function calculateRelevanceScore(gameName: string, searchQuery: string): number {
  if (!searchQuery || !gameName) {
    return 0;
  }

  const normalizedGame = gameName.toLowerCase().trim();
  const normalizedSearch = searchQuery.toLowerCase().trim();

  // Exact match (case-insensitive)
  if (normalizedGame === normalizedSearch) {
    return 100;
  }

  // Starts with search query
  if (normalizedGame.startsWith(normalizedSearch)) {
    return 80;
  }

  // Check word-by-word matching
  // Ignore short stop words (e.g., "to", "a", "of") by filtering out words shorter than MIN_SIGNIFICANT_WORD_LENGTH.
  const MIN_SIGNIFICANT_WORD_LENGTH = 3;
  const allSearchWords = normalizedSearch.split(/\s+/).filter((w) => w.length > 0);
  const significantSearchWords = allSearchWords.filter(
    (w) => w.length >= MIN_SIGNIFICANT_WORD_LENGTH
  );
  const searchWords = significantSearchWords.length > 0 ? significantSearchWords : allSearchWords;
  const gameWords = normalizedGame.split(/\s+/);

  // Count how many search words appear in game name (exact word match, not substring)
  const matchedWords = searchWords.filter((searchWord) =>
    gameWords.some((gameWord) => gameWord === searchWord)
  );

  const matchPercentage = matchedWords.length / searchWords.length;

  // Relevance score thresholds
  const SCORE_ALL_WORDS_MATCH = 60;
  const SCORE_MOST_WORDS_MATCH = 40;
  const SCORE_SOME_WORDS_MATCH = 20;
  const SCORE_POOR_MATCH = 5;
  const ALL_WORDS_MATCH_THRESHOLD = 1;
  const MOST_WORDS_MATCH_THRESHOLD = 0.75;
  const SOME_WORDS_MATCH_THRESHOLD = 0.5;

  // All words match
  if (matchPercentage === ALL_WORDS_MATCH_THRESHOLD) {
    return SCORE_ALL_WORDS_MATCH;
  }

  // Most words match (>= 75%)
  if (matchPercentage >= MOST_WORDS_MATCH_THRESHOLD) {
    return SCORE_MOST_WORDS_MATCH;
  }

  // Some words match (strictly more than 50% — prevents half-matches like 1/2 from passing)
  if (matchPercentage > SOME_WORDS_MATCH_THRESHOLD) {
    return SCORE_SOME_WORDS_MATCH;
  }

  // Poor match
  return SCORE_POOR_MATCH;
}

/**
 * Filters and sorts games by relevance to search query
 * @param games - Array of games from API
 * @param searchQuery - User's search input
 * @param minScore - Minimum relevance score to include (default: 20)
 * @returns Sorted and filtered games array
 */
export function filterAndSortByRelevance<T extends { name: string }>(
  games: T[],
  searchQuery: string,
  minScore: number = 20
): T[] {
  if (!searchQuery || !searchQuery.trim()) {
    return games; // No filtering if no search
  }

  // Calculate score for each game
  const gamesWithScores = games.map((game) => ({
    game,
    score: calculateRelevanceScore(game.name, searchQuery),
  }));

  // Filter by minimum score and sort descending
  return gamesWithScores
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score)
    .map(({ game }) => game);
}

/**
 * Checks if a game name is a strong match for search query
 * Used for highlighting or special treatment
 */
export function isStrongMatch(gameName: string, searchQuery: string): boolean {
  return calculateRelevanceScore(gameName, searchQuery) >= 60;
}
