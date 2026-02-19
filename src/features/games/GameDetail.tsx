/**
 * Game Detail Component
 */

"use client";

import { useRouter } from "next/navigation";
import { Box, Heading, Button, Spinner, Badge } from "@chakra-ui/react";
import { useGame } from "@/features/games/hooks/useGames";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface GameDetailProps {
  slug: string;
}

export function GameDetailPage({ slug }: GameDetailProps) {
  const router = useRouter();
  const { data: game, isLoading, error } = useGame(slug);

  if (isLoading) {
    return (
      <Box className="flex justify-center py-12">
        <Spinner className="h-8 w-8 text-blue-600" />
      </Box>
    );
  }

  if (error || !game) {
    return (
      <Box className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-600">Failed to load game details</p>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box className="space-y-6">
        <Button
          onClick={() => router.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back to Games
        </Button>

        {/* Hero Section */}
        <Box className="relative overflow-hidden rounded-lg">
          {game.backgroundImage && (
            <Box className="relative h-96 w-full">
              <img
                src={game.backgroundImage}
                alt={game.name}
                className="h-full w-full object-cover"
              />
              <Box className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <Box className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <Heading className="mb-2 text-4xl font-bold">{game.name}</Heading>
                <Box className="flex items-center gap-4">
                  {game.released && (
                    <span className="text-lg">{new Date(game.released).getFullYear()}</span>
                  )}
                  <Box className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-lg font-medium">{game.rating.toFixed(1)}</span>
                  </Box>
                  {game.metacritic && (
                    <Badge className="rounded bg-yellow-400 px-2 py-1 text-sm font-bold text-gray-900">
                      Metacritic: {game.metacritic}
                    </Badge>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <Box className="lg:col-span-2 space-y-6">
            {/* About */}
            <Box className="rounded-lg border border-gray-200 bg-white p-6">
              <Heading className="mb-4 text-xl font-bold text-gray-900">About</Heading>
              <Box
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />
            </Box>

            {/* Screenshots */}
            {game.shortScreenshots.length > 0 && (
              <Box className="rounded-lg border border-gray-200 bg-white p-6">
                <Heading className="mb-4 text-xl font-bold text-gray-900">Screenshots</Heading>
                <Box className="grid grid-cols-2 gap-4">
                  {game.shortScreenshots.slice(1, 5).map((screenshot) => (
                    <Box key={screenshot.id} className="overflow-hidden rounded-lg">
                      <img
                        src={screenshot.image}
                        alt="Screenshot"
                        className="h-full w-full object-cover"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Sidebar */}
          <Box className="space-y-6">
            {/* Platforms */}
            <Box className="rounded-lg border border-gray-200 bg-white p-6">
              <Heading className="mb-3 text-lg font-bold text-gray-900">Platforms</Heading>
              <Box className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <Badge
                    key={platform.id}
                    className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                  >
                    {platform.name}
                  </Badge>
                ))}
              </Box>
            </Box>

            {/* Genres */}
            <Box className="rounded-lg border border-gray-200 bg-white p-6">
              <Heading className="mb-3 text-lg font-bold text-gray-900">Genres</Heading>
              <Box className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </Box>
            </Box>

            {/* Developers */}
            {game.developers && game.developers.length > 0 && (
              <Box className="rounded-lg border border-gray-200 bg-white p-6">
                <Heading className="mb-3 text-lg font-bold text-gray-900">Developers</Heading>
                <Box className="space-y-1">
                  {game.developers.map((dev) => (
                    <p key={dev.id} className="text-sm text-gray-700">
                      {dev.name}
                    </p>
                  ))}
                </Box>
              </Box>
            )}

            {/* Publishers */}
            {game.publishers && game.publishers.length > 0 && (
              <Box className="rounded-lg border border-gray-200 bg-white p-6">
                <Heading className="mb-3 text-lg font-bold text-gray-900">Publishers</Heading>
                <Box className="space-y-1">
                  {game.publishers.map((pub) => (
                    <p key={pub.id} className="text-sm text-gray-700">
                      {pub.name}
                    </p>
                  ))}
                </Box>
              </Box>
            )}

            {/* Links */}
            {game.website && (
              <Box className="rounded-lg border border-gray-200 bg-white p-6">
                <Heading className="mb-3 text-lg font-bold text-gray-900">Links</Heading>
                <Box className="space-y-2">
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    Official Website →
                  </a>
                  {game.redditUrl && (
                    <a
                      href={game.redditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      Reddit Community →
                    </a>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  );
}
