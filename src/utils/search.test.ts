/**
 * Search Utility Tests
 * Tests relevance scoring and filtering logic
 */

import { describe, it, expect } from "vitest";
import { calculateRelevanceScore, filterAndSortByRelevance, isStrongMatch } from "./search";

describe("calculateRelevanceScore", () => {
  it("returns 100 for exact match (case-insensitive)", () => {
    expect(calculateRelevanceScore("Welcome to Elk", "Welcome to Elk")).toBe(100);
    expect(calculateRelevanceScore("Welcome to Elk", "welcome to elk")).toBe(100);
    expect(calculateRelevanceScore("WELCOME TO ELK", "welcome to elk")).toBe(100);
  });

  it("returns 80 for starts-with match", () => {
    expect(calculateRelevanceScore("Welcome to Elk Valley", "Welcome to Elk")).toBe(80);
    expect(calculateRelevanceScore("Welcome Home", "Welcome")).toBe(80);
  });

  it("returns 60 for all words matching", () => {
    expect(calculateRelevanceScore("The Welcome to Elk Game", "Welcome Elk")).toBe(60);
    expect(calculateRelevanceScore("Grand Theft Auto V", "Grand Auto")).toBe(60);
  });

  it("returns lower scores for partial matches", () => {
    const score = calculateRelevanceScore("Welcome Home", "Welcome to Elk");
    expect(score).toBeLessThan(60);
    expect(score).toBeGreaterThan(0);
  });

  it("returns 0 for empty inputs", () => {
    expect(calculateRelevanceScore("", "test")).toBe(0);
    expect(calculateRelevanceScore("test", "")).toBe(0);
    expect(calculateRelevanceScore("", "")).toBe(0);
  });

  it("handles multi-word searches correctly", () => {
    expect(calculateRelevanceScore("The Legend of Zelda", "Legend Zelda")).toBe(60);
    expect(calculateRelevanceScore("The Legend of Zelda", "Legend of")).toBe(60);
  });
});

describe("filterAndSortByRelevance", () => {
  const mockGames = [
    { name: "Welcome to Elk", id: 1 },
    { name: "Elk Hunter 2023", id: 2 },
    { name: "Welcome Home", id: 3 },
    { name: "The Great Elk Adventure", id: 4 },
    { name: "Totally Unrelated Game", id: 5 },
  ];

  it("filters and sorts games by relevance", () => {
    const result = filterAndSortByRelevance(mockGames, "Welcome to Elk");

    expect(result[0].name).toBe("Welcome to Elk"); // Exact match first
    expect(result.length).toBeLessThan(mockGames.length); // Some filtered out
  });

  it("returns all games when no search query", () => {
    const result = filterAndSortByRelevance(mockGames, "");
    expect(result).toEqual(mockGames);
  });

  it("filters out low-relevance results", () => {
    const result = filterAndSortByRelevance(mockGames, "Welcome to Elk", 20);
    const names = result.map((g) => g.name);

    expect(names).toContain("Welcome to Elk");
    expect(names).not.toContain("Totally Unrelated Game");
  });

  it("adjusts filtering based on minScore", () => {
    const strictResults = filterAndSortByRelevance(mockGames, "Elk", 60);
    const lenientResults = filterAndSortByRelevance(mockGames, "Elk", 20);

    expect(strictResults.length).toBeLessThanOrEqual(lenientResults.length);
  });
});

describe("isStrongMatch", () => {
  it("returns true for exact and close matches", () => {
    expect(isStrongMatch("Welcome to Elk", "Welcome to Elk")).toBe(true);
    expect(isStrongMatch("Welcome to Elk Valley", "Welcome to Elk")).toBe(true);
  });

  it("returns false for weak matches", () => {
    expect(isStrongMatch("Elk", "Welcome to Elk")).toBe(false);
    expect(isStrongMatch("Totally Different", "Welcome to Elk")).toBe(false);
  });
});
