import React, { useState } from "react";
import Select from "react-select";
import { useAppSelector } from "@hooks/hooks";
import { selectComplaintStatusCodeDropdown } from "@store/reducers/code-table";

interface Option {
  value: string | undefined;
  label: string | undefined;
}

type Props = {
  onSelectChange: (selectedValue: string) => void;
  isDisabled?: boolean;
};

const ComplaintStatusSelect: React.FC<Props> = ({ onSelectChange, isDisabled = false }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const options = useAppSelector(selectComplaintStatusCodeDropdown);

  const handleChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);
    onSelectChange(selectedOption?.value ? selectedOption.value : "");
  };

  return (
    <div>
      <Select
        id="complaint_status_dropdown"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        classNamePrefix="comp-select"
        placeholder="Select"
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default ComplaintStatusSelect;
