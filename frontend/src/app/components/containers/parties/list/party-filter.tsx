import { FC } from "react";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import { PartySearchParams, usePartySearch } from "../hooks/use-party-search";
import { useAppSelector } from "@hooks/hooks";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";

export const PartyFilter: FC = () => {
  const { searchValues, setValues } = usePartySearch();
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const partyTypeOptions = partyTypes
    ?.sort((left: any, right: any) => left.displayOrder - right.displayOrder)
    .map((code: any) => {
      return {
        value: code.value,
        label: code.label,
      };
    });

  const handleFieldChange = (fieldName: keyof PartySearchParams) => (option: Option | null) => {
    setValues({ [fieldName]: option?.value });
  };

  const renderSelectFilter = (
    id: string,
    label: string,
    options: Option[],
    placeholder: string,
    value: Option | null,
    onChange: (option: Option | null) => void,
  ) => (
    <div id={`party-${id}-filter-id`}>
      <label htmlFor={`party-${id}-select-id`}>{label}</label>
      <div className="filter-select-padding">
        <CompSelect
          id={`party-${id}-select-id`}
          classNamePrefix="comp-select"
          onChange={onChange}
          classNames={{
            menu: () => "top-layer-select",
          }}
          options={options}
          placeholder={placeholder}
          enableValidation={false}
          value={value}
          isClearable={true}
          showInactive={false}
        />
      </div>
    </div>
  );

  return (
    <div className="comp-filter-container">
      {renderSelectFilter(
        "partyType",
        "Party Type",
        partyTypeOptions,
        "Select party type",
        partyTypeOptions.find((option) => option.value === searchValues.partyTypeCode) || null,
        handleFieldChange("partyTypeCode"),
      )}
    </div>
  );
};
