import { FC, useEffect, useState } from "react";
import Select from 'react-select'
import axios from "axios";
import config from "../../../../../config";
import DatePicker from "react-datepicker";
import "../../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import Option from "../../../../types/app/option";

type Props = {
    getCollapseProps: Function;
    isExpanded: boolean;
    violationFilter: Option | null,
    setViolationFilter: Function,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    setStartDateFilter: Function,
    setEndDateFilter: Function
    complaintStatusFilter: Option | null,
    setComplaintStatusFilter: Function,
}


export const AllegationComplaintFilterContainer: FC<Props>  = ({getCollapseProps, isExpanded, violationFilter, setViolationFilter, startDateFilter, endDateFilter, setStartDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter}) => {
    const [violationCodes, setViolationCodes] = useState<Option[]>([] as Array<Option>);
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
                    await axios.get(`${config.API_BASE_URL}/v1/violation-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.violation_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                        transformedOptions.unshift({value: "", label: ""});
                        setViolationCodes(transformedOptions);
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
      const handleViolationFilter = (selectedOption: Option | null) => {
        setViolationFilter(selectedOption);
      }; 
      const handleComplaintStatusCodes = (selectedOption: Option | null) => {
        setComplaintStatusFilter(selectedOption);
      }; 
      const complaintStatusClass =  (complaintStatusFilter === null || complaintStatusFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const dateStatusClass = (startDateFilter === null || startDateFilter === undefined) ? 'hidden' : 'comp-filter-pill';
      const violationClass =  (violationFilter === null || violationFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const pillContainterStyle = (complaintStatusClass !== 'hidden' || dateStatusClass !== 'hidden' || violationClass !== 'hidden') ? 'comp-filter-pill-container' : '';
    return( <>
      <div className="collapsible">
      <div {...getCollapseProps()}>
      <div className="content" style={{margin: '0px 0px 10px 0px'}}>
        <div style={{float:'left'}}>
          test float
        </div>
        <div style={{clear:'left'}}></div>
        <div className="comp-filter-left">
          <div className="comp-filter-label">
              Violation Type
          </div>
          <div>
              <Select options={violationCodes} onChange={handleViolationFilter} placeholder="Select" value={violationFilter}/>
          </div>
        </div>
        <div className="comp-filter">
          <div className="comp-filter-label">
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
                      <span style={{top: "5px"}}
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
                      <span style={{top: "5px"}}
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
        </div>
        <div className="comp-filter">
          <div className="comp-filter-label">
              Status
          </div>
          <div> 
              <Select options={complaintStatusCodes} onChange={handleComplaintStatusCodes} placeholder="Select" value={complaintStatusFilter}/>
          </div>
      </div>
      <div style={{clear:'left'}}></div>
      </div>
      </div>
      <div className={pillContainterStyle}>
        <div className={complaintStatusClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{complaintStatusFilter?.label}
              <button type="button" className="btn-close btn-close-white" aria-label="Close" style={{pointerEvents: "auto"}} onClick={() => setComplaintStatusFilter(null)}></button>
            </button>
          </div>
          <div className={dateStatusClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{(startDateFilter === undefined && endDateFilter === undefined ) ? "" : (startDateFilter !== undefined && endDateFilter !== undefined) ? startDateFilter?.toLocaleDateString() + " - " + endDateFilter?.toLocaleDateString() : (startDateFilter !== undefined) ? startDateFilter?.toLocaleDateString() + " - " : (endDateFilter !== undefined) ? " - " + endDateFilter?.toLocaleDateString() : ""}
              <button type="button" className="btn-close btn-close-white" aria-label="Close" style={{pointerEvents: "auto"}} onClick={() => {setStartDateFilter();setEndDateFilter();}}></button>
            </button>
          </div>
          <div className={violationClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{violationFilter?.label}
              <button type="button" className="btn-close btn-close-white" aria-label="Close" style={{pointerEvents: "auto"}}  onClick={() => {setViolationFilter(null)}}></button>
            </button>
          </div>
        </div>
        </div>
    </>)
}