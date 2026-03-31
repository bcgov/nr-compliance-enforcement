import { ReactNode } from "react";

export type CompColumn<T> = {
  label: string;
  isHidden?: boolean;
  sortKey?: string;
  headerClassName?: string;
  cellClassName?: string;
  isSortable?: boolean;
  getValue?: (row: T) => string | number;
  renderCell: (row: T) => ReactNode;
};

export type CompTableSharedProps<T> = {
  columns: CompColumn<T>[];
  renderExpandedContent?: (row: T) => ReactNode;
};

export type CompTableProps<T> = CompTableSharedProps<T> & {
  data: T[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  pageSize?: number;
  defaultSortLabel: string;
  defaultSortDirection?: string;
  error?: Error | null;
  onSort?: (sortKey: string, sortDirection: string) => void;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  currentPage?: number;
  emptyMessage?: string;
};

export type CompTableRowProps<T> = CompTableSharedProps<T> & {
  row: T;
  rowKey: string;
  isExpanded: boolean;
  onToggleExpand: (rowKey: string) => void;
};
