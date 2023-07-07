import { FC, useEffect, useState } from "react";
import Select from 'react-select'
import axios from "axios";
import config from "../../../../../config";
import DatePicker from "react-datepicker";
import "../../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import Option from "../../../../types/app/option";

type Props = {
    getCollapseProps: Function,
    isExpanded: boolean,
    regionCodeFilter: Option | null,
    setRegionCodeFilter: Function,
    zoneCodeFilter: Option | null,
    setZoneCodeFilter: Function,
    areaCodeFilter: Option | null,
    setAreaCodeFilter: Function,
    officerFilter: Option | null,
    setOfficerFilter: Function,
    natureOfComplaintFilter: Option | null,
    setNatureOfComplaintFilter: Function,
    speciesCodeFilter: Option | null,
    setSpeciesCodeFilter: Function,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    setStartDateFilter: Function,
    setEndDateFilter: Function,
    complaintStatusFilter: Option | null,
    setComplaintStatusFilter: Function,
}


export const HwcrComplaintFilterContainer: FC<Props>  = ({getCollapseProps, isExpanded, regionCodeFilter, setRegionCodeFilter, zoneCodeFilter, setZoneCodeFilter, areaCodeFilter, setAreaCodeFilter, officerFilter, setOfficerFilter, natureOfComplaintFilter, setNatureOfComplaintFilter, speciesCodeFilter,
      setSpeciesCodeFilter, startDateFilter, endDateFilter, setStartDateFilter, setEndDateFilter, complaintStatusFilter, setComplaintStatusFilter}) => {

    const [regionCodes, setRegionCodes] = useState<Option[]>([] as Array<Option>);
    const [zoneCodes, setZoneCodes] = useState<Option[]>([] as Array<Option>);
    const [areaCodes, setAreaCodes] = useState<Option[]>([] as Array<Option>);
    const [officers, setOfficers] = useState<Option[]>([] as Array<Option>);
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
                  
                    await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint-nature-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.hwcr_complaint_nature_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                        setHwcrNatureOfComplaintCodes(transformedOptions);
                    });
                    await axios.get(`${config.API_BASE_URL}/v1/species-code`).then((response) => {
                        const transformedOptions: Option[] = response.data.map((item: any) => ({
                            value: item.species_code, // Assuming each item has an 'id' property
                            label: item.long_description, // Assuming each item has a 'name' property
                          }));
                        setSpeciesCodes(transformedOptions);
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
      }, [regionCodeFilter, zoneCodeFilter, areaCodeFilter, officerFilter, natureOfComplaintFilter, speciesCodeFilter, startDateFilter, endDateFilter, complaintStatusFilter]);
      const handleRegionCodeFilter = (selectedOption: Option | null) => {
        setRegionCodeFilter(selectedOption);
      }; 
      const handleZoneCodeFilter = (selectedOption: Option | null) => {
        setZoneCodeFilter(selectedOption);
      }; 
      const handleAreaCodeFilter = (selectedOption: Option | null) => {
        setAreaCodeFilter(selectedOption);
      }; 
      const handleOfficerFilter = (selectedOption: Option | null) => {
        setOfficerFilter(selectedOption);
      }; 
      const handleNatureOfComplaintFilter = (selectedOption: Option | null) => {
        setNatureOfComplaintFilter(selectedOption);
      }; 
      const handleSpeciesCodesFilter = (selectedOption: Option | null) => {
        setSpeciesCodeFilter(selectedOption);
      }; 
      const handleComplaintStatusCodes = (selectedOption: Option | null) => {
        setComplaintStatusFilter(selectedOption);
      }; 
      const complaintStatusClass =  (complaintStatusFilter === null || complaintStatusFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const dateStatusClass = (startDateFilter === null || startDateFilter === undefined) ? 'hidden' : 'comp-filter-pill';
      const speciesClass =  (speciesCodeFilter === null || speciesCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const natureOfComplaintClass =  (natureOfComplaintFilter === null || natureOfComplaintFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const officerClass =  (officerFilter === null || officerFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const areaClass =  (areaCodeFilter === null || areaCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const zoneClass =  (zoneCodeFilter === null || zoneCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const regionClass =  (regionCodeFilter === null || regionCodeFilter.value === '') ? 'hidden' : 'comp-filter-pill';
      const pillContainterStyle = (complaintStatusClass !== 'hidden' || dateStatusClass !== 'hidden' || speciesClass !== 'hidden' || natureOfComplaintClass !== 'hidden' || officerClass !== 'hidden' || areaClass !== 'hidden' || zoneClass !== 'hidden' || regionClass !== 'hidden') ? 'comp-filter-pill-container' : '';
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
        <div className="comp-filter-left">
          <div className="comp-filter-label" id="comp-filter-region-id">
              Region
          </div>
          <div className="filter-select-padding">
              <Select options={regionCodes} onChange={handleRegionCodeFilter} placeholder="Select" value={regionCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-zone-id">
          <div className="comp-filter-label">
              Zone
          </div>
          <div className="filter-select-padding">
              <Select options={zoneCodes} onChange={handleZoneCodeFilter} placeholder="Select" value={zoneCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-community-id">
          <div className="comp-filter-label">
              Community
          </div>
          <div className="filter-select-padding">
              <Select options={areaCodes} onChange={handleAreaCodeFilter} placeholder="Select" value={areaCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter" id="comp-filter-officer-id">
          <div className="comp-filter-label">
              Officer Assigned
          </div>
          <div className="filter-select-padding">
              <Select options={officers} onChange={handleOfficerFilter} placeholder="Select" value={officerFilter} classNamePrefix="input-field-select"/>
          </div>
        </div>
        <div className="clear-left-float"></div>
      </div>
      <div className="content filter-container" id="comp-filter-nature-id">
        <div className="comp-filter-left">
          <div className="comp-filter-label">
              Nature of Complaint
          </div>
          <div className="filter-select-padding">
              <Select options={hwcrNatureOfComplaintCodes} onChange={handleNatureOfComplaintFilter} placeholder="Select" value={natureOfComplaintFilter}/>
          </div>
        </div>
        <div className="comp-filter"id="comp-filter-species-id">
          <div className="comp-filter-label">
              Species
          </div>
          <div className="filter-select-padding"> 
              <Select options={speciesCodes} onChange={handleSpeciesCodesFilter} placeholder="Select"  value={speciesCodeFilter}/>
          </div>
        </div>
        <div className="comp-filter"id="comp-filter-date-id">
          <div className="comp-filter-label">
              Date Logged
          </div>
          <div className="filter-select-padding">
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
          <div className="filter-select-padding"> 
              <Select options={complaintStatusCodes} onChange={handleComplaintStatusCodes} placeholder="Select" value={complaintStatusFilter} />
          </div>
        </div>
        <div className="clear-left-float"></div>
      </div>
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
          <div className={speciesClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{speciesCodeFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => {setSpeciesCodeFilter(null)}}></button>
            </button>
          </div>
          <div className={natureOfComplaintClass}>
            <button type="button" className="btn btn-primary comp-filter-btn">{natureOfComplaintFilter?.label}
              <button type="button" className="btn-close btn-close-white filter-pill-close" aria-label="Close" onClick={() => setNatureOfComplaintFilter(null)}></button>
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
    </>)
}