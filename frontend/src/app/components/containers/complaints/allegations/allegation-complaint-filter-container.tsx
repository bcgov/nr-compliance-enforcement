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
    regionCodeFilter: Option | null,
    setRegionCodeFilter: Function,
    zoneCodeFilter: Option | null,
    setZoneCodeFilter: Function,
    areaCodeFilter: Option | null,
    setAreaCodeFilter: Function,
    officerFilter: Option | null,
    setOfficerFilter: Function,
    violationFilter: Option | null,
    setViolationFilter: Function,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    setStartDateFilter: Function,
    setEndDateFilter: Function
    complaintStatusFilter: Option | null,
    setComplaintStatusFilter: Function,
}


export const AllegationComplaintFilterContainer: FC<Props>  = ({getCollapseProps, isExpanded, regionCodeFilter, setRegionCodeFilter, zoneCodeFilter, setZoneCodeFilter, areaCodeFilter, setAreaCodeFilter, officerFilter, setOfficerFilter, violationFilter, setViolationFilter, startDateFilter, endDateFilter, setStartDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter}) => {
    const [regionCodes, setRegionCodes] = useState<Option[]>([] as Array<Option>);
    const [zoneCodes, setZoneCodes] = useState<Option[]>([] as Array<Option>);
    const [areaCodes, setAreaCodes] = useState<Option[]>([] as Array<Option>);
    const [officers, setOfficers] = useState<Option[]>([] as Array<Option>);
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
                    await axios.get(`${config.API_BASE_URL}/v1/geo-organization-unit-code/find-all-regions`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.geo_organization_unit_code, // Assuming each item has an 'id' property
                            label: item.short_description, // Assuming each item has a 'name' property
                          }));
                          setRegionCodes(transformedOptions);
                    });
    
                    await axios.get(`${config.API_BASE_URL}/v1/geo-organization-unit-code/find-all-zones`).then((response) => {
                      const transformedOptions: Option[] = response.data.map((item: any) => ({
                          value: item.geo_organization_unit_code, // Assuming each item has an 'id' property
                          label: item.short_description, // Assuming each item has a 'name' property
                        }));
                        setZoneCodes(transformedOptions);
                  });
    
                  await axios.get(`${config.API_BASE_URL}/v1/geo-organization-unit-code/find-all-areas`).then((response) => {
                    const transformedOptions: Option[] = response.data.map((item: any) => ({
                        value: item.geo_organization_unit_code, // Assuming each item has an 'id' property
                        label: item.short_description, // Assuming each item has a 'name' property
                      }));
                      setAreaCodes(transformedOptions);
                });
                await axios.get(`${config.API_BASE_URL}/v1/officer`).then((response) => {
                  const transformedOptions: Option[] = response.data.map((item: any) => ({
                      value: item.person_guid.person_guid, // Assuming each item has an 'id' property
                      label: item.person_guid.first_name.substring(0,1) + ". " + item.person_guid.last_name, // Assuming each item has a 'name' property
                    }));
                    transformedOptions.unshift({value: "null", label: ""});
                    setOfficers(transformedOptions);
              });
                    await axios.get(`${config.API_BASE_URL}/v1/violation-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.violation_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                        setViolationCodes(transformedOptions);
                    });
                    await axios.get(`${config.API_BASE_URL}/v1/complaint-status-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.complaint_status_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                          setComplaintStatusCodes(transformedOptions);
                    });
            }
        }
        fetchCodes()
        .catch(err => console.log(err));
      }, []);
      const handleRegionFilter = (selectedOption: Option | null) => {
        setRegionCodeFilter(selectedOption);
      }; 
      const handleZoneFilter = (selectedOption: Option | null) => {
        setZoneCodeFilter(selectedOption);
      }; 
      const handleAreaFilter = (selectedOption: Option | null) => {
        setAreaCodeFilter(selectedOption);
      }; 
      const handleOfficerFilter = (selectedOption: Option | null) => {
        setOfficerFilter(selectedOption);
      }; 
      const handleViolationFilter = (selectedOption: Option | null) => {
        setViolationFilter(selectedOption);
      }; 
      const handleComplaintStatusCodes = (selectedOption: Option | null) => {
        setComplaintStatusFilter(selectedOption);
      }; 
      const complaintStatusClass =  (complaintStatusFilter === null || complaintStatusFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const dateStatusClass = (startDateFilter === null || startDateFilter === undefined) ? 'hidden' : 'comp-filter-pill';
      const violationClass =  (violationFilter === null || violationFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const officerClass =  (officerFilter === null || officerFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const areaClass =  (areaCodeFilter === null || areaCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const zoneClass =  (zoneCodeFilter === null || zoneCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const regionClass =  (regionCodeFilter === null || regionCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const pillContainterStyle = (complaintStatusClass !== 'hidden' || dateStatusClass !== 'hidden' || violationClass !== 'hidden' || officerClass !== 'hidden' || areaClass !== 'hidden' || zoneClass !== 'hidden' || regionClass !== 'hidden') ? 'comp-filter-pill-container' : '';
      let datePillText = "";
      if(startDateFilter !== undefined && endDateFilter !== undefined)
      {
        datePillText = startDateFilter?.toLocaleDateString() + " - " + endDateFilter?.toLocaleDateString()
      } 
      else if(startDateFilter !== undefined)
      { 
        datePillText = startDateFilter?.toLocaleDateString() + " - "
      } 
      else if(endDateFilter !== undefined)
      {
        datePillText = " - " + endDateFilter?.toLocaleDateString()
      }
    return( <>
      <div className="collapsible" id="collapsible-complaints-list-filter-id">
      <div {...getCollapseProps()}>
      <div className="content filter-container">
        <div className="comp-filter-left" id="comp-filter-region-id">
          <div className="comp-filter-label">
              Region
          </div>
          <div className="filter-select-padding">
              <Select options={regionCodes} onChange={handleRegionFilter} placeholder="Select" value={regionCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-zone-id">
          <div className="comp-filter-label">
              Zone
          </div>
          <div className="filter-select-padding">
              <Select options={zoneCodes} onChange={handleZoneFilter} placeholder="Select" value={zoneCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-community-id">
          <div className="comp-filter-label">
              Community
          </div>
          <div className="filter-select-padding">
              <Select options={areaCodes} onChange={handleAreaFilter} placeholder="Select" value={areaCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-officer-id">
          <div className="comp-filter-label">
              Officer Assigned
          </div>
          <div className="filter-select-padding">
              <Select options={officers} onChange={handleOfficerFilter} placeholder="Select" value={officerFilter}  classNamePrefix="input-field-select"/>
          </div>
        </div>
        <div className="clear-left-float"></div>
      </div>
      <div className="content filter-container" id="comp-filter-violation-id">
        <div className="comp-filter-left">
          <div className="comp-filter-label">
              Violation Type
          </div>
          <div>
              <Select options={violationCodes} onChange={handleViolationFilter} placeholder="Select" value={violationFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-date-id">
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
                        `react-datepicker__navigation react-datepicker__navigation--previous ${customHeaderCount === 1 ? 'datepicker-nav-hidden' : 'datepicker-nav-visible'}`
                      }
                      onClick={decreaseMonth}
                    >
                      <span
                        className={
                          "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous datepicker-nav-icon"
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
                        `react-datepicker__navigation react-datepicker__navigation--next ${customHeaderCount === 1 ? 'datepicker-nav-hidden' : 'datepicker-nav-visible'}`
                      }
                      onClick={increaseMonth}
                    >
                      <span
                        className={
                          "react-datepicker__navigation-icon react-datepicker__navigation-icon--next datepicker-nav-icon"
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
        <div className="comp-filter" id="comp-filter-status-id">
          <div className="comp-filter-label">
              Status
          </div>
          <div> 
              <Select options={complaintStatusCodes} onChange={handleComplaintStatusCodes} placeholder="Select" value={complaintStatusFilter}/>
          </div>
      </div>
      <div className="clear-left-float"></div>
      </div>
      </div>
      <div className={pillContainterStyle}>
        <div className={complaintStatusClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{complaintStatusFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => setComplaintStatusFilter(null)}></button>
            </button>
          </div>
          <div className={dateStatusClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{datePillText}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => {setStartDateFilter();setEndDateFilter();}}></button>
            </button>
          </div>
          <div className={violationClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{violationFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => {setViolationFilter(null)}}></button>
            </button>
          </div>
          <div className={officerClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{(officerFilter?.label === "" ? "Unassigned" : officerFilter?.label)}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => setOfficerFilter(null)}></button>
            </button>
          </div>
          <div className={areaClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{areaCodeFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => setAreaCodeFilter(null)}></button>
            </button>
          </div>
          <div className={zoneClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{zoneCodeFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => setZoneCodeFilter(null)}></button>
            </button>
          </div>
          <div className={regionClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{regionCodeFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => setRegionCodeFilter(null)}></button>
            </button>
          </div>
        </div>
        </div>
    </>)
}