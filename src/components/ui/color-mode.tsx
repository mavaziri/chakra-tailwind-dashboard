/**
 * Color Mode Provider
 * Simple passthrough component - Chakra UI v3 handles SSR internally
 */

"use client";

import type { ReactNode } from "react";

export type ColorModeProviderProps = {
  children?: ReactNode;
};

export function ColorModeProvider(props: ColorModeProviderProps) {
  return <>{props.children}</>;
}
