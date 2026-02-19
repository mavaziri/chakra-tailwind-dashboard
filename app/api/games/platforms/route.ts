/**
 * Game Platforms API Route
 * Server-side proxy for RAWG API platforms calls
 */

import { NextResponse } from "next/server";
import { getRawgApiKey, config } from "@/config/app.config";

export async function GET() {
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

    const url = `${config.api.rawg.baseUrl}/platforms?key=${apiKey}`;

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
    console.error("Error fetching platforms:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to fetch platforms" }, { status: 500 });
  }
}
