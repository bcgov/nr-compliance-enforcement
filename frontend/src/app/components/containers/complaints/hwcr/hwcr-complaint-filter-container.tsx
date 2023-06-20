import { FC, useEffect, useState } from "react";
import Select from 'react-select'
import axios from "axios";
import config from "../../../../../config";
import DatePicker from "react-datepicker";
import "../../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";

type Props = {
    setNatureOfComplaintFilter: Function,
    setSpeciesCodeFilter: Function,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    setStartDateFilter: Function,
    setEndDateFilter: Function
    setComplaintStatusFilter: Function,
}


export const HwcrComplaintFilterContainer: FC<Props>  = ({setNatureOfComplaintFilter, setSpeciesCodeFilter, startDateFilter, endDateFilter, setStartDateFilter, setEndDateFilter, setComplaintStatusFilter}) => {
    const [hwcrNatureOfComplaintCodes, setHwcrNatureOfComplaintCodes] = useState<Option[]>([] as Array<Option>);
    const [speciesCodes, setSpeciesCodes] = useState<Option[]>([] as Array<Option>);
    const [complaintStatusCodes, setComplaintStatusCodes] = useState<Option[]>([] as Array<Option>);
    const handleDateFilter = (dates: [any, any]) => {
        const [start, end] = dates;
        setStartDateFilter(start);
        setEndDateFilter(end);
      };

    useEffect(() => {
        async function fetchCodes()
        {
            const token = localStorage.getItem("user");
            if (token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint-nature-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.hwcr_complaint_nature_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                        transformedOptions.unshift({value: "", label: ""});
                        setHwcrNatureOfComplaintCodes(transformedOptions);
                    });
                    await axios.get(`${config.API_BASE_URL}/v1/species-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.species_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                        transformedOptions.unshift({value: "", label: ""});
                        setSpeciesCodes(transformedOptions);
                    });
                    await axios.get(`${config.API_BASE_URL}/v1/complaint-status-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.complaint_status_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                          transformedOptions.unshift({value: "", label: ""});
                          setComplaintStatusCodes(transformedOptions);
                    });
            }
        }
        fetchCodes()
        .catch(err => console.log(err));
      }, []);
      const handleNatureOfComplaintFilter = (selectedOption: Option | null) => {
        setNatureOfComplaintFilter(selectedOption?.value);
      }; 
      const handleSpeciesCodesFilter = (selectedOption: Option | null) => {
        setSpeciesCodeFilter(selectedOption?.value);
      }; 
      const handleComplaintStatusCodes = (selectedOption: Option | null) => {
        setComplaintStatusFilter(selectedOption?.value);
      }; 
    return( 
    <>
        <div>
            Nature of Complaint:   
        </div>
        <div>
            <Select options={hwcrNatureOfComplaintCodes} onChange={handleNatureOfComplaintFilter} placeholder="Select"/>
        </div>
        <div>
            Species:  
        </div>
        <div> 
            <Select options={speciesCodes} onChange={handleSpeciesCodesFilter} placeholder="Select" />
        </div>
        <div>
            Date Logged
        </div>
        <div>
        <DatePicker
            showIcon={true}
            renderCustomHeader={({
                monthDate,
                customHeaderCount,
                decreaseMonth,
                increaseMonth,
              }) => (
                <div>
                  <button
                    aria-label="Previous Month"
                    className={
                      "react-datepicker__navigation react-datepicker__navigation--previous"
                    }
                    style={customHeaderCount === 1 ? { visibility: "hidden" } : { visibility: "visible" }}
                    onClick={decreaseMonth}
                  >
                    <span
                      className={
                        "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                      }
                    >
                      {"<"}
                    </span>
                  </button>
                  <span className="react-datepicker__current-month">
                    {monthDate.toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    aria-label="Next Month"
                    className={
                      "react-datepicker__navigation react-datepicker__navigation--next"
                    }
                    style={customHeaderCount === 0 ? { visibility: "hidden" } : { visibility: "visible" }}
                    onClick={increaseMonth}
                  >
                    <span
                      className={
                        "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                      }
                    >
                      {">"}
                    </span>
                  </button>
                </div>
              )}
            selected={startDateFilter}
            onChange={handleDateFilter}
            startDate={startDateFilter}
            endDate={endDateFilter}
            monthsShown={2}
            selectsRange={true}
            isClearable={true}
            
            />
        </div>
        <div>
            Status:  
        </div>
        <div> 
            <Select options={complaintStatusCodes} onChange={handleComplaintStatusCodes} placeholder="Select" />
        </div>
    </>)
}