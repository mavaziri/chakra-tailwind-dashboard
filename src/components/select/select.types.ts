/**
 * Advanced Select Component Types
 */

export interface SelectOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface GroupedOption<T = unknown> {
  label?: string;
  options: SelectOption<T>[];
}

export interface SelectProps<T = unknown> {
  options: GroupedOption<T>[];
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  virtualized?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

export interface SelectContextValue<T = unknown> {
  selected: T[];
  isOpen: boolean;
  searchQuery: string;
  toggle: () => void;
  close: () => void;
  setSearchQuery: (query: string) => void;
  selectOption: (value: T) => void;
  deselectOption: (value: T) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isSelected: (value: T) => boolean;
}
