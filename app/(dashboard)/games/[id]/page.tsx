/**
 * Game Detail Page
 * Dynamic route: /games/[id]
 */

import { GameDetailPage } from "@/features/games/GameDetail";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { id } = await params;
  return <GameDetailPage slug={id} />;
}
