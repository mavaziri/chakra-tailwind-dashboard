/**
 * Select Component Utilities
 */

import { SelectOption, GroupedOption } from "./select.types";

/**
 * Filters options based on search query
 */
export function filterOptions<T>(groups: GroupedOption<T>[], query: string): GroupedOption<T>[] {
  if (!query.trim()) {
    return groups;
  }

  const lowerQuery = query.toLowerCase();

  return groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) => option.label.toLowerCase().includes(lowerQuery)),
    }))
    .filter((group) => group.options.length > 0);
}

/**
 * Gets all option values from grouped options
 */
export function getAllValues<T>(groups: GroupedOption<T>[]): T[] {
  return groups.flatMap((group) => group.options.map((option) => option.value));
}

/**
 * Finds option by value
 */
export function findOptionByValue<T>(
  groups: GroupedOption<T>[],
  value: T
): SelectOption<T> | undefined {
  for (const group of groups) {
    const option = group.options.find((opt) => opt.value === value);
    if (option) {
      return option;
    }
  }

  return undefined;
}

/**
 * Gets label for selected value
 */
export function getLabel<T>(groups: GroupedOption<T>[], value: T): string {
  const option = findOptionByValue(groups, value);
  return option?.label || String(value);
}
