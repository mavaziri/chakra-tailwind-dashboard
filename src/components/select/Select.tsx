/**
 * Advanced Select Component
 * Enterprise-grade dropdown with search, multi-select, groups, and virtualization
 *
 * Features:
 * - Generic typing
 * - Multi-select support
 * - Search/filter
 * - Grouped options
 * - Select All/None
 * - Virtualization for large datasets
 * - Keyboard navigation
 * - Controlled & uncontrolled modes
 * - Compound component pattern
 *
 * @example
 * ```tsx
 * <Select<string>
 *   options={[{ options: [{ label: "Option 1", value: "1" }] }]}
 *   multiple
 *   searchable
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 */

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Listbox } from "@headlessui/react";
import { Box, Input, Badge } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SelectProps } from "./select.types";
import { filterOptions, getAllValues, getLabel } from "./select.utils";

export function Select<T = unknown>(props: SelectProps<T>) {
  const {
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    multiple = false,
    searchable = false,
    virtualized = false,
    placeholder = "Select...",
    disabled = false,
    className = "",
    maxHeight = 300,
  } = props;

  const [internalValue, setInternalValue] = useState<T[]>(defaultValue || []);
  const [searchQuery, setSearchQuery] = useState("");
  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : internalValue;

  // Filter options based on search
  const filteredOptions = useMemo(
    () => (searchable ? filterOptions(options, searchQuery) : options),
    [options, searchQuery, searchable]
  );

  // Flatten options for virtualization
  const flatOptions = useMemo(() => {
    return filteredOptions.flatMap((group) =>
      group.label
        ? [
            { type: "group" as const, label: group.label },
            ...group.options.map((opt) => ({ type: "option" as const, ...opt })),
          ]
        : group.options.map((opt) => ({ type: "option" as const, ...opt }))
    );
  }, [filteredOptions]);

  const handleChange = useCallback(
    (newSelected: T[]) => {
      if (!isControlled) {
        setInternalValue(newSelected);
      }

      onChange?.(newSelected);
    },
    [isControlled, onChange]
  );

  const selectAll = useCallback(() => {
    const allValues = getAllValues(filteredOptions);
    handleChange(allValues);
  }, [filteredOptions, handleChange]);

  const deselectAll = useCallback(() => {
    handleChange([]);
  }, [handleChange]);

  // Check if option is selected
  const isSelected = useCallback((value: T) => selected.some((v) => v === value), [selected]);

  // Display text
  const displayText = useMemo(() => {
    if (selected.length === 0) {
      return placeholder;
    }

    if (selected.length === 1) {
      return getLabel(options, selected[0]);
    }

    return `${selected.length} selected`;
  }, [selected, options, placeholder]);

  // Virtualization setup
  const parentRef = React.useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: flatOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    enabled: virtualized && flatOptions.length > 50,
  });

  return (
    <Listbox
      value={selected}
      onChange={(newValue) => handleChange(Array.isArray(newValue) ? newValue : [newValue])}
      multiple={multiple}
      disabled={disabled}
    >
      {({ open }) => (
        <Box className={`relative ${className}`}>
          {/* Trigger Button */}
          <Listbox.Button className="flex relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100">
            <span className="block truncate text-gray-900">{displayText}</span>
            {selected.length > 0 && multiple && (
              <Badge className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                {selected.length}
              </Badge>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Listbox.Button>

          {/* Options Dropdown */}
          {open && (
            <Listbox.Options
              static
              className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none"
            >
              {/* Search Input */}
              {searchable && (
                <Box className="border-b border-gray-200 p-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              )}

              {/* Select All/None Actions */}
              {multiple && filteredOptions.length > 0 && (
                <Box className="flex gap-2 border-b border-gray-200 p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      selectAll();
                    }}
                    className="flex-1 rounded bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();

                      deselectAll();
                    }}
                    className="flex-1 rounded bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Clear
                  </button>
                </Box>
              )}

              {/* Options List */}
              <div
                ref={parentRef}
                style={{ maxHeight: `${maxHeight}px` }}
                className="overflow-y-auto"
              >
                {virtualized && flatOptions.length > 50 ? (
                  // Virtualized List
                  <div
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                      const item = flatOptions[virtualItem.index];

                      if (item.type === "group") {
                        return (
                          <div
                            key={virtualItem.key}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: `${virtualItem.size}px`,
                              transform: `translateY(${virtualItem.start}px)`,
                            }}
                            className="px-3 py-2 text-xs font-semibold uppercase text-gray-500"
                          >
                            {item.label}
                          </div>
                        );
                      }

                      return (
                        <Listbox.Option
                          key={virtualItem.key}
                          value={item.value}
                          disabled={item.disabled}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                          }}
                          className={({ active, selected: optionSelected }) =>
                            `cursor-pointer select-none px-3 py-2 ${
                              active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                            } ${optionSelected ? "font-semibold" : "font-normal"} ${
                              item.disabled ? "cursor-not-allowed opacity-50" : ""
                            }`
                          }
                        >
                          {({ selected: optionSelected }) => (
                            <Box className="flex items-center justify-between">
                              <span>{item.label}</span>
                              {optionSelected && (
                                <svg
                                  className="h-5 w-5 text-blue-600"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </Box>
                          )}
                        </Listbox.Option>
                      );
                    })}
                  </div>
                ) : (
                  // Regular List
                  <>
                    {filteredOptions.length === 0 ? (
                      <Box className="px-3 py-4 text-center text-sm text-gray-500">
                        No options found
                      </Box>
                    ) : (
                      filteredOptions.map((group, groupIndex) => (
                        <Box key={groupIndex}>
                          {group.label && (
                            <Box className="px-3 py-2 text-xs font-semibold uppercase text-gray-500">
                              {group.label}
                            </Box>
                          )}
                          {group.options.map((option, optionIndex) => (
                            <Listbox.Option
                              key={optionIndex}
                              value={option.value}
                              disabled={option.disabled}
                              className={({ active }) =>
                                `cursor-pointer select-none px-3 py-2 ${
                                  active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                                } ${isSelected(option.value) ? "font-semibold" : "font-normal"} ${
                                  option.disabled ? "cursor-not-allowed opacity-50" : ""
                                }`
                              }
                            >
                              {() => (
                                <Box className="flex items-center justify-between">
                                  <span>{option.label}</span>
                                  {isSelected(option.value) && (
                                    <svg
                                      className="h-5 w-5 text-blue-600"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </Box>
                              )}
                            </Listbox.Option>
                          ))}
                        </Box>
                      ))
                    )}
                  </>
                )}
              </div>
            </Listbox.Options>
          )}
        </Box>
      )}
    </Listbox>
  );
}
