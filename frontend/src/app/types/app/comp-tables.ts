import { ReactNode } from "react";

export type CompColumn<T> = {
  label: string;
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
};

export type CompTableRowProps<T> = CompTableSharedProps<T> & {
  row: T;
  rowKey: string;
  isExpanded: boolean;
  onToggleExpand: (rowKey: string) => void;
};
