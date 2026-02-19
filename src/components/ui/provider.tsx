/**
 * Chakra UI Provider Component
 * Configured for Next.js App Router with proper SSR support
 */

"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export function Provider(props: { children: React.ReactNode }) {
  return <ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>;
}
