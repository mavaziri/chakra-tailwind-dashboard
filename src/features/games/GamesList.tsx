/**
 * Games List Component
 * Client component with search, filters, and pagination
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Input, Spinner } from "@chakra-ui/react";
import { useGames, useGenres, usePlatforms } from "./hooks/useGames";
import { useDebounce } from "@/hooks/useDebounce";
import { Select, GroupedOption } from "@/components/select";
import { GameFilters } from "@/domain/game/game.model";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { filterAndSortByRelevance } from "@/utils/search";

export function GamesListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string[]>(["-rating"]);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: genres } = useGenres();
  const { data: platforms } = usePlatforms();

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedGenres, selectedPlatforms, sortBy]);

  // Build filters
  const filters: GameFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      genres: selectedGenres.join(",") || undefined,
      platforms: selectedPlatforms.join(",") || undefined,
      ordering: sortBy[0] || "-rating",
      page,
      pageSize: 20,
    }),
    [debouncedSearch, selectedGenres, selectedPlatforms, sortBy, page]
  );

  const { data, isLoading, error } = useGames(filters);

  // Apply client-side relevance filtering when search is active
  // This compensates for RAWG API's broad OR-based word matching
  const filteredGames = useMemo(() => {
    if (!data || !debouncedSearch) return data;

    return {
      ...data,
      items: filterAndSortByRelevance(data.items, debouncedSearch, 20),
    };
  }, [data, debouncedSearch]);

  // Use filtered data for rendering
  const displayData = debouncedSearch ? filteredGames : data;

  // Debug logging (can be removed in production)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[GamesList] Filters updated:", filters);
      console.log("[GamesList] Search query:", searchQuery);
      console.log("[GamesList] Debounced search:", debouncedSearch);
      if (debouncedSearch && data && filteredGames) {
        console.log("[GamesList] API returned:", data.items.length, "games");
        console.log("[GamesList] After relevance filter:", filteredGames.items.length, "games");
      }
    }
  }, [filters, searchQuery, debouncedSearch, data, filteredGames]);

  // Genre options
  const genreOptions: GroupedOption<string>[] = useMemo(
    () => [
      {
        label: "Genres",
        options: (genres || []).map((genre) => ({
          label: genre.name,
          value: genre.id.toString(),
        })),
      },
    ],
    [genres]
  );

  // Platform options (limited to major platforms)
  const platformOptions: GroupedOption<string>[] = useMemo(
    () => [
      {
        label: "Platforms",
        options: (platforms || [])
          .filter((p) => [4, 187, 1, 18, 7].includes(p.id)) // PC, PS5, Xbox One, PS4, Switch
          .map((platform) => ({
            label: platform.name,
            value: platform.id.toString(),
          })),
      },
    ],
    [platforms]
  );

  const sortOptions: GroupedOption<string>[] = [
    {
      options: [
        { label: "Highest Rated", value: "-rating" },
        { label: "Lowest Rated", value: "rating" },
        { label: "Most Recent", value: "-released" },
        { label: "Oldest", value: "released" },
        { label: "Name (A-Z)", value: "name" },
        { label: "Name (Z-A)", value: "-name" },
      ],
    },
  ];

  return (
    <ErrorBoundary>
      <Box className="space-y-6">
        <Heading className="text-2xl font-bold text-gray-900">Games</Heading>

        {/* Filters */}
        <Box className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Box className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Box>

          <Select<string>
            options={genreOptions}
            value={selectedGenres}
            onChange={setSelectedGenres}
            multiple
            searchable
            placeholder="Select genres"
          />

          <Select<string>
            options={platformOptions}
            value={selectedPlatforms}
            onChange={setSelectedPlatforms}
            multiple
            placeholder="Select platforms"
          />
        </Box>

        <Box className="flex items-center gap-4">
          <Select<string>
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-64"
          />
        </Box>

        {/* Loading */}
        {isLoading && (
          <Box className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-blue-600" />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Box className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : "Failed to load games"}
            </p>
          </Box>
        )}

        {/* Games Grid */}
        {displayData && !isLoading && (
          <>
            <Box className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayData.items.map((game) => (
                <Box
                  key={game.id}
                  onClick={() => router.push(`/games/${game.slug}`)}
                  className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                >
                  <Box className="relative aspect-video w-full overflow-hidden bg-gray-900">
                    {game.backgroundImage ? (
                      <img
                        src={game.backgroundImage}
                        alt={game.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Box className="flex h-full items-center justify-center text-gray-500">
                        No image
                      </Box>
                    )}
                    {game.metacritic && (
                      <Box className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-gray-900">
                        {game.metacritic}
                      </Box>
                    )}
                  </Box>
                  <Box className="p-4">
                    <Heading className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                      {game.name}
                    </Heading>
                    <Box className="mb-2 flex items-center gap-2">
                      <Box className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {game.rating.toFixed(1)}
                        </span>
                      </Box>
                      {game.released && (
                        <span className="text-sm text-gray-500">
                          {new Date(game.released).getFullYear()}
                        </span>
                      )}
                    </Box>
                    <Box className="flex flex-wrap gap-1">
                      {game.genres.slice(0, 2).map((genre) => (
                        <span
                          key={genre.id}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            <Box className="flex items-center justify-between">
              <Box className="text-sm text-gray-700">
                Page {page}
                {debouncedSearch && displayData && (
                  <> • {displayData.items.length} relevant results</>
                )}
                {!debouncedSearch && displayData && (
                  <> • {displayData.total.toLocaleString()} games</>
                )}
              </Box>
              <Box className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!displayData?.next}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </ErrorBoundary>
  );
}
