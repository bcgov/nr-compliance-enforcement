import { BaseCodeTable } from "../code-tables/base-code-table";

export interface TaskType extends BaseCodeTable {
  taskCategoryDetail: string;
  taskCategory: string;
}
