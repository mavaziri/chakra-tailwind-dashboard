/**
 * Emotion Cache Configuration for Next.js App Router
 * Ensures consistent style injection between server and client
 */

"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

export interface EmotionCacheProviderProps {
  children: React.ReactNode;
}

/**
 * Creates Emotion cache with consistent configuration
 */
function createEmotionCache() {
  return createCache({ key: "css", prepend: true });
}

/**
 * Emotion Cache Provider for Next.js App Router
 * Handles style extraction on server and hydration on client
 */
export function EmotionCacheProvider({ children }: EmotionCacheProviderProps) {
  const [cache] = useState(() => {
    const cache = createEmotionCache();
    cache.compat = true; // Enable compat mode for better SSR support
    return cache;
  });

  useServerInsertedHTML(() => {
    // Extract styles from Emotion cache for server-side rendering
    const inserted = cache.inserted;
    if (!inserted || typeof inserted === "string") {
      return null;
    }

    const names: string[] = [];
    const styles: string[] = [];

    // Iterate over cache entries
    for (const [key, value] of Object.entries(inserted)) {
      if (typeof value === "string") {
        names.push(key);
        styles.push(value);
      }
    }

    if (styles.length === 0) return null;

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles.join("") }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
