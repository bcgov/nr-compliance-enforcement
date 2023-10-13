import { FC, useCallback, useContext } from "react";
import Select from "react-select";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import { useAppSelector } from "../../../hooks/hooks";
import { selectCodeTable } from "../../../store/reducers/code-table";
import { selectOfficersDropdown } from "../../../store/reducers/officer";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import DatePicker from "react-datepicker";
import { useCollapse } from "react-collapsed";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import {
  ComplaintFilterPayload,
  updateFilter,
} from "../../../store/reducers/complaint-filters";
import { DropdownOption } from "../../../types/code-tables/option";

type Props = {
  type: string;
  isOpen: boolean;
};

export const ComplaintFilter: FC<Props> = ({ type, isOpen }) => {
  const { getCollapseProps } = useCollapse({ isExpanded: isOpen });
  const {
    state: {
      region,
      zone,
      community,
      officer,
      species,
      natureOfComplaint,
      violationType,
      status,
      startDate,
      endDate,
    },
    dispatch,
  } = useContext(ComplaintFilterContext);

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

  const setFilter = useCallback(
    (name: string, value?: DropdownOption | Date | null) => {
      let payload: ComplaintFilterPayload = { filter: name, value };
      dispatch(updateFilter(payload));
    },
    []
  );

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setFilter("startDate", start);

    end.setHours(23, 59, 59);
    end.setMilliseconds(999);

    setFilter("endDate", end);
  };

  // manual entry of date change listener.  Looks for a date range format of {yyyy-mm-dd} - {yyyy-mm-dd}
  const handleManualDateRangeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e?.target?.value?.includes(" - ")) {
      const [startDateStr, endDateStr] = e.target.value.split(" - ");
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        // Invalid date format
        return [null, null];
      } else {
        endDate.setDate(endDate.getDate() + 1);
        handleDateRangeChange([startDate, endDate]);
      }
    }
    return [null, null];
  };

  ///--
  /// Render out the filter drawer by the complaint type passed from the parent complaint component
  /// Each type of compplaint needs to have its own unique second row of filters specified
  ///--
  const renderComplaintFilters = (): JSX.Element => {
    return (
      <div className="content filter-container">
        {COMPLAINT_TYPES.HWCR === type && ( // wildlife only filter
          <>
            <div
              className="comp-filter-left"
              id="comp-filter-nature-of-complaint-id"
            >
              <div className="comp-filter-label">Nature of Complaint</div>
              <div className="filter-select-padding">
                <Select
                  options={natureOfComplaintTypes}
                  onChange={(option) => {
                    setFilter("natureOfComplaint", option);
                  }}
                  placeholder="Select"
                  classNamePrefix="comp-select"
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  id="nature-of-complaint-select-id"
                  value={natureOfComplaint}
                />
              </div>
            </div>
            <div className="comp-filter" id="comp-species-filter-id">
              <div className="comp-filter-label">Species</div>
              <div className="filter-select-padding">
                <Select
                  options={speciesTypes}
                  onChange={(option) => {
                    setFilter("species", option);
                  }}
                  placeholder="Select"
                  classNamePrefix="comp-select"
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  id="species-select-id"
                  value={species}
                />
              </div>
            </div>
          </>
        )}

        {COMPLAINT_TYPES.ERS === type && ( // wildlife only filter
          <div className="comp-filter-left" id="comp-filter-violation-id">
            {/* <!-- violation types --> */}
            <div className="comp-filter-label">Violation Type</div>
            <div className="filter-select-padding">
              <Select
                options={violationTypes}
                onChange={(option) => {
                  setFilter("violationType", option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                classNames={{
                  menu: () => "top-layer-select",
                }}
                id="violation-type-select-id"
                value={violationType}
              />
            </div>
          </div>
        )}

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
              onChangeRaw={handleManualDateRangeChange}
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
        <div className="comp-filter" id="comp-filter-status-id">
          <div className="comp-filter-label">Status</div>
          <div className="filter-select-padding">
            <Select
              options={statusTypes}
              onChange={(option) => {
                setFilter("status", option);
              }}
              placeholder="Select"
              classNamePrefix="comp-select"
              classNames={{
                menu: () => "top-layer-select",
              }}
              id="status-select-id"
              value={status}
            />
          </div>
        </div>
        <div className="clear-left-float"></div>
      </div>
    );
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
                  setFilter("region", option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                classNames={{
                  menu: () => "top-layer-select",
                }}
                value={region}
                id="region-select-filter-id"
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
                  setFilter("zone", option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                classNames={{
                  menu: () => "top-layer-select",
                }}
                id="zone-select-id"
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
                  setFilter("community", option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                classNames={{
                  menu: () => "top-layer-select",
                }}
                id="community-select-id"
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
                  setFilter("officer", option);
                }}
                placeholder="Select"
                classNamePrefix="comp-select"
                classNames={{
                  menu: () => "top-layer-select",
                }}
                id="officer-select-id"
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
