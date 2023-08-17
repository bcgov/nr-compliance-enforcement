import { FC, useContext, useState } from "react";
import Select from "react-select";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import { useAppSelector } from "../../../hooks/hooks";
import { selectCodeTable } from "../../../store/reducers/code-table";
import { selectOfficersDropdown } from "../../../store/reducers/officer";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import DatePicker from "react-datepicker";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { ComplaintFilterState } from "../../../types/providers/complaint-filter-provider-type";
import { useCollapse } from "react-collapsed";

type Props = {
  type: string;
  isOpen: boolean;
};

export const ComplaintFilter: FC<Props> = ({ type, isOpen }) => {
  const { getCollapseProps } = useCollapse({ isExpanded: isOpen });

  const {
    filters,
    setRegion,
    setZone,
    setCommunity,
    setOfficer,
    setStartDate,
    setEndDate,
    setStatus,
    setSpecies,
    setNatureOfComplaint,
    setViolationType,
  } = useContext(ComplaintFilterContext);
  const {
    region,
    zone,
    community,
    officer,
    startDate,
    endDate,
    status,
    species,
    natureOfComplaint,
    violationType,
  } = filters as ComplaintFilterState;

  const regions = useAppSelector(selectCodeTable("regions"));
  const zones = useAppSelector(selectCodeTable("zones"));
  const communities = useAppSelector(selectCodeTable("communities"));
  const officers = useAppSelector(selectOfficersDropdown);
  const natureOfComplaintTypes = useAppSelector(
    selectCodeTable("wildlifeNatureOfComplaintCodes")
  );
  const speciesTypes = useAppSelector(selectCodeTable("speciesCodes"));
  const statusTypes = useAppSelector(selectCodeTable("complaintStatusCodes"));
  const violationTypes = useAppSelector(selectCodeTable("violationCodes"));

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  ///--
  /// Render out the filter drawer by the complaint type passed from the parent complaint component
  /// Each type of compplaint needs to have its own unique second row of filters specified
  ///--
  const renderComplaintFilters = (): JSX.Element => {

    //--
    //-- generate wildlife complaint filters
    //--
    const renderWildlifeFilters = (): JSX.Element => {
      return (
        <div className="content filter-container">
          {/* <!-- wildlife filters --> */}
          <div className="comp-filter-left" id="comp-filter-region-id">
            {/* <!-- nature of complaints --> */}
            <div className="comp-filter-label">Nature of Complaint</div>
            <div className="filter-select-padding">
              <Select
                options={natureOfComplaintTypes}
                onChange={(option) => {
                  setNatureOfComplaint(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={natureOfComplaint}
              />
            </div>
          </div>
          {/* <!-- species --> */}
          <div className="comp-filter" id="comp-filter-zone-id">
            <div className="comp-filter-label">Species</div>
            <div className="filter-select-padding">
              <Select
                options={speciesTypes}
                onChange={(option) => {
                  setSpecies(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={species}
              />
            </div>
          </div>

          {/* <!-- date logged --> */}
          <div className="comp-filter" id="comp-filter-date-id">
            <div className="comp-filter-label">Date Logged</div>
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
                      className={`react-datepicker__navigation react-datepicker__navigation--previous ${
                        customHeaderCount === 1
                          ? "datepicker-nav-hidden"
                          : "datepicker-nav-visible"
                      }`}
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
                      className={`react-datepicker__navigation react-datepicker__navigation--next ${
                        customHeaderCount === 1
                          ? "datepicker-nav-hidden"
                          : "datepicker-nav-visible"
                      }`}
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
                selected={startDate}
                onChange={handleDateRangeChange}
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                monthsShown={2}
                selectsRange={true}
                isClearable={true}
                wrapperClassName="comp-filter-calendar-input"
              />
            </div>
          </div>

          {/* <!-- status --> */}
          <div className="comp-filter" id="comp-filter-officer-id">
            <div className="comp-filter-label">Status</div>
            <div className="filter-select-padding">
              <Select
                options={statusTypes}
                onChange={(option) => {
                  setStatus(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={status}
              />
            </div>
          </div>
          <div className="clear-left-float"></div>
        </div>
      );
    };

    //--
    //-- generate allegation complaint filters
    //--
    const renderAllegationFilters = (): JSX.Element => {
      return (
        <div className="content filter-container">
          {/* <!-- allegation filters --> */}
          <div className="comp-filter-left" id="comp-filter-region-id">
            {/* <!-- violation types --> */}
            <div className="comp-filter-label">Violation Type</div>
            <div className="filter-select-padding">
              <Select
                options={violationTypes}
                onChange={(option) => {
                  setViolationType(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={violationType}
              />
            </div>
          </div>

          {/* <!-- date logged --> */}
          <div className="comp-filter" id="comp-filter-date-id">
            <div className="comp-filter-label">Date Logged</div>
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
                      className={`react-datepicker__navigation react-datepicker__navigation--previous ${
                        customHeaderCount === 1
                          ? "datepicker-nav-hidden"
                          : "datepicker-nav-visible"
                      }`}
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
                      className={`react-datepicker__navigation react-datepicker__navigation--next ${
                        customHeaderCount === 1
                          ? "datepicker-nav-hidden"
                          : "datepicker-nav-visible"
                      }`}
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
                selected={startDate}
                onChange={handleDateRangeChange}
                startDate={startDate}
                endDate={endDate}
                dateFormat="yyyy-MM-dd"
                monthsShown={2}
                selectsRange={true}
                isClearable={true}
                wrapperClassName="comp-filter-calendar-input"
              />
            </div>
          </div>

          {/* <!-- status --> */}
          <div className="comp-filter" id="comp-filter-officer-id">
            <div className="comp-filter-label">Status</div>
            <div className="filter-select-padding">
              <Select
                options={statusTypes}
                onChange={(option) => {
                  setStatus(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={status}
              />
            </div>
          </div>
          <div className="clear-left-float"></div>
        </div>
      );
    };

    switch (type) {
      case COMPLAINT_TYPES.ERS:
        return renderAllegationFilters();
      case COMPLAINT_TYPES.HWCR:
      default:
        return renderWildlifeFilters();
    }
  };

  return (
    <div className="collapsible" id="collapsible-complaints-list-filter-id">
      <div {...getCollapseProps()}>
        {/* props */}
        <div className="content filter-container">
          {/* <!-- tombstone --> */}
          <div className="comp-filter-left" id="comp-filter-region-id">
            {/* <!-- region --> */}
            <div className="comp-filter-label">Region</div>
            <div className="filter-select-padding">
              <Select
                options={regions}
                onChange={(option) => {
                  setRegion(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={region}
              />
            </div>
          </div>
          {/* <!-- zones --> */}
          <div className="comp-filter" id="comp-filter-zone-id">
            <div className="comp-filter-label">Zone</div>
            <div className="filter-select-padding">
              <Select
                options={zones}
                onChange={(option) => {
                  setZone(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={zone}
              />
            </div>
          </div>

          {/* <!-- communities --> */}
          <div className="comp-filter" id="comp-filter-community-id">
            <div className="comp-filter-label">Community</div>
            <div className="filter-select-padding">
              <Select
                options={communities}
                onChange={(option) => {
                  setCommunity(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={community}
              />
            </div>
          </div>

          {/* <!-- officers --> */}
          <div className="comp-filter" id="comp-filter-officer-id">
            <div className="comp-filter-label">Officer Assigned</div>
            <div className="filter-select-padding">
              <Select
                options={officers}
                onChange={(option) => {
                  setOfficer(option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                value={officer}
              />
            </div>
          </div>
          <div className="clear-left-float"></div>
        </div>
        {renderComplaintFilters()}
      </div>
    </div>
  );
};
