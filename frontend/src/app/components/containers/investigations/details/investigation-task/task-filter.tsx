import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { useTaskSearch } from "./hooks/use-task-search";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectTaskCategory, selectTaskSubCategory, selectTaskStatus } from "@/app/store/reducers/code-table-selectors";
import { selectOfficerAgency } from "@/app/store/reducers/app";
import { selectOfficersByAgency } from "@/app/store/reducers/officer";

export const TaskFilter: FC = () => {
  const { searchValues, setValues } = useTaskSearch();

  const taskCategories = useAppSelector(selectTaskCategory);
  const taskSubCategories = useAppSelector(selectTaskSubCategory);
  const taskStatuses = useAppSelector(selectTaskStatus);
  const agency = useAppSelector(selectOfficerAgency);
  const officers = useAppSelector((state) => selectOfficersByAgency(state, agency));

  const categoryOptions: Option[] = taskCategories.map((c) => ({
    value: String(c.value ?? ""),
    label: String(c.label ?? ""),
  }));

  const subCategoryOptions: Option[] = taskSubCategories
    .filter((s) => s.taskCategory === searchValues.categoryFilter && s.label !== "None")
    .map((s) => ({ value: String(s.value ?? ""), label: String(s.label ?? "") }));

  const statusOptions: Option[] = taskStatuses.map((s) => ({
    value: String(s.value ?? ""),
    label: String(s.label ?? ""),
  }));

  const officerOptions: Option[] = [...(officers ?? [])]
    .map((o) => ({ value: o.app_user_guid, label: `${o.last_name}, ${o.first_name}` }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  const handleCategoryFilterChange = (option: Option | null) => {
    setValues({ categoryFilter: option?.value ?? null, subCategoryFilter: null });
  };

  const handleSubCategoryFilterChange = (option: Option | null) => {
    setValues({ subCategoryFilter: option?.value ?? null });
  };

  const handleStatusFilterChange = (option: Option | null) => {
    setValues({ statusFilter: option?.value ?? null });
  };

  const handleOfficerFilterChange = (option: Option | null) => {
    setValues({ officerFilter: option?.value ?? null });
  };

  const selectedCategory = categoryOptions.find((option) => option.value === searchValues.categoryFilter) || null;
  const selectedSubCategory =
    subCategoryOptions.find((option) => option.value === searchValues.subCategoryFilter) || null;
  const selectedStatus = statusOptions.find((option) => option.value === searchValues.statusFilter) || null;
  const selectedOfficer = officerOptions.find((option) => option.value === searchValues.officerFilter) || null;

  return (
    <div className="comp-filter-container">
      <div id="task-category-filter-id">
        <label htmlFor="task-category-select-id">Category</label>
        <div className="filter-select-padding">
          <CompSelect
            id="task-category-select-id"
            classNamePrefix="comp-select"
            onChange={handleCategoryFilterChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={categoryOptions}
            placeholder="Select"
            enableValidation={false}
            value={selectedCategory}
            isClearable={true}
            showInactive={false}
          />
        </div>
      </div>

      <div id="task-subcategory-filter-id">
        <label htmlFor="task-subcategory-select-id">Sub-category</label>
        <div className="filter-select-padding">
          <CompSelect
            key={searchValues.categoryFilter ?? ""}
            id="task-subcategory-select-id"
            classNamePrefix="comp-select"
            onChange={handleSubCategoryFilterChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={subCategoryOptions}
            placeholder="Select"
            enableValidation={false}
            value={selectedSubCategory}
            isClearable={true}
            showInactive={false}
            isDisabled={!searchValues.categoryFilter}
          />
        </div>
      </div>

      <div id="task-status-filter-id">
        <label htmlFor="task-status-select-id">Status</label>
        <div className="filter-select-padding">
          <CompSelect
            id="task-status-select-id"
            classNamePrefix="comp-select"
            onChange={handleStatusFilterChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={statusOptions}
            placeholder="Select"
            enableValidation={false}
            value={selectedStatus}
            isClearable={true}
            showInactive={false}
          />
        </div>
      </div>

      <div id="task-officer-filter-id">
        <label htmlFor="task-officer-select-id">Officer assigned</label>
        <div className="filter-select-padding">
          <CompSelect
            id="task-officer-select-id"
            classNamePrefix="comp-select"
            onChange={handleOfficerFilterChange}
            classNames={{
              menu: () => "top-layer-select",
            }}
            options={officerOptions}
            placeholder="Select"
            enableValidation={false}
            value={selectedOfficer}
            isClearable={true}
            showInactive={false}
            menuPlacement="top"
          />
        </div>
      </div>
    </div>
  );
};
