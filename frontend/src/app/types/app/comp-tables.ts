import { ReactNode } from "react";

export type CompColumn<T> = {
  label: string; // Display label for the column
  isHidden?: boolean; // used to conditionally hide columns
  sortKey?: string; // key to use for server side sorting.  Defaults to label if not provided
  headerClassName?: string; // list of classes to apply to header of the column
  cellClassName?: string; // list of classes to apply to the cells of the column
  isSortable?: boolean; //  boolean flag to determine if sort arrows should appear
  getValue?: (row: T) => string | number; // call back to get the values of the cells to enable sorting
  renderCell: (row: T) => ReactNode; // Component to display in each non header cell
};

export type CompTableSharedProps<T> = {
  columns: CompColumn<T>[]; // Table definition
  renderExpandedContent?: (row: T) => ReactNode; // For expandable tables the component to display in the expanded area
};

export type CompTableProps<T> = CompTableSharedProps<T> & {
  data: T[]; // The data to be displayed in the table
  tableIdentifier: string; // id for the table
  isFixedHeight: boolean; // true for tables that are always on the page and large regardless of data (e.g. complaints, tasks)
  getRowKey: (row: T) => string; // Callback to get a unique identifier for a row
  isLoading?: boolean; // For GraphQL driven tables can display a loading spinner while fetching data
  pageSize?: number; // The number of entries per page to display
  defaultSortLabel: string; // The column to initially sort the table by
  defaultSortDirection?: string; // the direction to intially sort the table by
  error?: Error | null; // Allows the caller to display a custom error message
  onSort?: (sortKey: string, sortDirection: string) => void; // callback to define behavior when table is sorted
  onPageChange?: (page: number) => void; // callback to define behavior when page is changed
  totalItems?: number; // the total number of items in the dataset
  currentPage?: number; // the current page the user is on
  emptyMessage?: string; // custom message to display when there is no data to display in the table
};

export type CompTableRowProps<T> = CompTableSharedProps<T> & {
  row: T; // The data to be display in the row
  rowKey: string; // unique identifier for the row
  isExpanded: boolean; // tracks if the table is expanded or not
  onToggleExpand: (rowKey: string) => void; // callback for what to do when the table is expanded
};
