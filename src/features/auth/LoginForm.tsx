/**
 * Login Form Component
 * Client component for authentication
 */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Input, Button, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "@/features/auth/auth-context";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl") || "/users";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ username, password });
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <Heading className="mb-6 text-center text-2xl font-bold text-gray-900">
        Enterprise Dashboard
      </Heading>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Box>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </Box>

        <Box>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </Box>

        {error && (
          <Box className="rounded-md bg-red-50 p-3">
            <Text className="text-sm text-red-600">{error}</Text>
          </Box>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <Box className="mt-6 rounded-md bg-gray-50 p-4">
        <Text className="text-sm font-medium text-gray-700">Demo Credentials:</Text>
        <Text className="mt-1 text-xs text-gray-600">Username: emilys</Text>
        <Text className="text-xs text-gray-600">Password: emilyspass</Text>
      </Box>
    </Box>
  );
}
