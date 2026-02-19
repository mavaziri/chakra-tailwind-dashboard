/**
 * Games API Route
 * Server-side proxy for RAWG API calls
 */

import { NextRequest, NextResponse } from "next/server";
import { getRawgApiKey, config } from "@/config/app.config";

export async function GET(request: NextRequest) {
  try {
    const apiKey = getRawgApiKey();

    if (!apiKey) {
      console.error("[API ERROR] RAWG API key not configured");
      return NextResponse.json(
        {
          error: "RAWG API key not configured",
          message:
            "Please add RAWG_API_KEY to .env.local and restart the server. Get your free key from: https://rawg.io/apidocs",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Forward all query params to RAWG API and add key
    const params = new URLSearchParams(searchParams);
    params.append("key", apiKey);

    const url = `${config.api.rawg.baseUrl}/games?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[RAWG API ERROR] Status ${response.status}:`, error);
      return NextResponse.json(
        {
          error: `RAWG API error: ${response.statusText}`,
          details: error,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API ERROR] Error fetching games:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}
