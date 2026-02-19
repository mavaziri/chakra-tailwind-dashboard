/**
 * Error Boundary Component
 * Catches and displays React errors gracefully
 */

"use client";

import React, { Component, ReactNode } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <Box className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <Box className="max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
            <Heading className="mb-4 text-2xl font-bold text-red-600">Something went wrong</Heading>
            <Text className="mb-4 text-gray-600">{this.state.error.message}</Text>
            <Button
              onClick={this.handleReset}
              className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}
