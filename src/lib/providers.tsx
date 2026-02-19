/**
 * Application Providers
 * Wraps the app with all necessary context providers
 * Includes Emotion cache for consistent SSR/client styling
 */

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { AuthProvider } from "@/features/auth/auth-context";
import { EmotionCacheProvider } from "./emotion-cache";
import { createQueryClient } from "./react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a stable query client instance per component tree
  const [queryClient] = useState(() => createQueryClient());

  return (
    <EmotionCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <AuthProvider>{children}</AuthProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </EmotionCacheProvider>
  );
}
