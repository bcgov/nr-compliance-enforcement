import { FC, useCallback, useContext } from "react";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import { useAppSelector } from "../../../hooks/hooks";
import {
  selectHwcrNatureOfComplaintCodeDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
  selectCascadedRegion,
  selectCascadedZone,
  selectCascadedCommunity,
  selectComplaintStatusWithPendingCodeDropdown,
} from "../../../store/reducers/code-table";
import { selectOfficersDropdown } from "../../../store/reducers/officer";
import COMPLAINT_TYPES from "../../../types/app/complaint-types";
import DatePicker from "react-datepicker";
import { CompSelect } from "../../common/comp-select";
import { ComplaintFilterContext } from "../../../providers/complaint-filter-provider";
import { ComplaintFilterPayload, updateFilter } from "../../../store/reducers/complaint-filters";
import Option from "../../../types/app/option";

type Props = {
  type: string;
};

export const ComplaintFilter: FC<Props> = ({ type }) => {
  const {
    state: { region, zone, community, officer, species, natureOfComplaint, violationType, status, startDate, endDate },
    dispatch,
  } = useContext(ComplaintFilterContext);

  let officers = useAppSelector(selectOfficersDropdown(false));
  if (officers && officers[0]?.value !== "Unassigned") {
    officers.unshift({ value: "Unassigned", label: "Unassigned" });
  }
  const natureOfComplaintTypes = useAppSelector(selectHwcrNatureOfComplaintCodeDropdown);
  const speciesTypes = useAppSelector(selectSpeciesCodeDropdown);
  const statusTypes = useAppSelector(selectComplaintStatusWithPendingCodeDropdown);
  const violationTypes = useAppSelector(selectViolationCodeDropdown);

  const regions = useAppSelector(selectCascadedRegion(region?.value, zone?.value, community?.value));
  const zones = useAppSelector(selectCascadedZone(region?.value, zone?.value, community?.value));
  const communities = useAppSelector(selectCascadedCommunity(region?.value, zone?.value, community?.value));

  const setFilter = useCallback(
    (name: string, value?: Option | Date | null) => {
      let payload: ComplaintFilterPayload = { filter: name, value };
      dispatch(updateFilter(payload));
    },
    [dispatch],
  );

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setFilter("startDate", start);
    //set the time to be end of day to ensure that we also search for records after the beginning of the selected day.
    if (start) {
      start.setHours(0, 0, 0);
      start.setMilliseconds(0);
    }
    if (end) {
      end.setHours(23, 59, 59);
      end.setMilliseconds(999);
    }

    setFilter("endDate", end);
  };

  // manual entry of date change listener.  Looks for a date range format of {yyyy-mm-dd} - {yyyy-mm-dd}
  const handleManualDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.value?.includes(" - ")) {
      const [startDateStr, endDateStr] = e.target.value.split(" - ");
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        // Invalid date format
        return [null, null];
      } else {
        //  add 1 to date because days start at 0
        startDate.setDate(startDate.getDate() + 1);
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
      <div className="comp-filter-container">
        {COMPLAINT_TYPES.HWCR === type && ( // wildlife only filter
          <>
            <div id="comp-filter-nature-of-complaint-id">
              <label htmlFor="nature-of-complaint-select-id">Nature of Complaint</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="nature-of-complaint-select-id"
                  classNamePrefix="comp-select"
                  onChange={(option) => {
                    setFilter("natureOfComplaint", option);
                  }}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={natureOfComplaintTypes}
                  placeholder="Select"
                  enableValidation={false}
                  value={natureOfComplaint}
                />
              </div>
            </div>
            <div id="comp-species-filter-id">
              <label htmlFor="species-select-id">Species</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="species-select-id"
                  classNamePrefix="comp-select"
                  onChange={(option) => {
                    setFilter("species", option);
                  }}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={speciesTypes}
                  placeholder="Select"
                  enableValidation={false}
                  value={species}
                />
              </div>
            </div>
          </>
        )}

        {COMPLAINT_TYPES.ERS === type && ( // wildlife only filter
          <div id="comp-filter-violation-id">
            {/* <!-- violation types --> */}
            <label htmlFor="violation-type-select-id">Violation Type</label>
            <div className="filter-select-padding">
              <CompSelect
                id="violation-type-select-id"
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("violationType", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={violationTypes}
                placeholder="Select"
                enableValidation={false}
                value={violationType}
              />
            </div>
          </div>
        )}

        {/* <!-- date logged --> */}
        <div id="comp-filter-date-id">
          <label htmlFor="date-range-picker-id">Date Logged</label>
          <div className="filter-select-padding">
            <DatePicker
              id="date-range-picker-id"
              showIcon={true}
              renderCustomHeader={({ monthDate, customHeaderCount, decreaseMonth, increaseMonth }) => (
                <div>
                  <button
                    aria-label="Previous Month"
                    className={`react-datepicker__navigation react-datepicker__navigation--previous ${
                      customHeaderCount === 1 ? "datepicker-nav-hidden" : "datepicker-nav-visible"
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
                      customHeaderCount === 1 ? "datepicker-nav-hidden" : "datepicker-nav-visible"
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
        <div id="comp-filter-status-id">
          <label htmlFor="status-select-id">Status</label>
          <div className="filter-select-padding">
            <CompSelect
              id="status-select-id"
              classNamePrefix="comp-select"
              onChange={(option) => {
                setFilter("status", option);
              }}
              classNames={{
                menu: () => "top-layer-select",
              }}
              options={statusTypes}
              placeholder="Select"
              enableValidation={false}
              value={status}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="collapsible-complaints-list-filter-id">
      <div>
        {/* props */}
        <div className="comp-filter-container">
          {/* <!-- tombstone --> */}
          <div id="comp-filter-region-id">
            {/* <!-- region --> */}
            <label htmlFor="region-select-filter-id">Region</label>
            <div className="filter-select-padding">
              <CompSelect
                id="region-select-filter-id"
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("region", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={regions}
                placeholder="Select"
                enableValidation={false}
                value={region}
              />
            </div>
          </div>
          {/* <!-- zones --> */}
          <div id="comp-filter-zone-id">
            <label htmlFor="zone-select-id">Zone</label>
            <div className="filter-select-padding">
              <CompSelect
                id="zone-select-id"
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("zone", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={zones}
                placeholder="Select"
                enableValidation={false}
                value={zone}
              />
            </div>
          </div>

          {/* <!-- communities --> */}
          <div id="comp-filter-community-id">
            <label htmlFor="community-select-id">Community</label>
            <div className="filter-select-padding">
              <CompSelect
                id="community-select-id"
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("community", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={communities}
                placeholder="Select"
                enableValidation={false}
                value={community}
              />
            </div>
          </div>

          {/* <!-- officers --> */}
          <div id="comp-filter-officer-id">
            <label htmlFor="officer-select-id">Officer Assigned</label>
            <div className="filter-select-padding">
              <CompSelect
                id="officer-select-id"
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("officer", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={officers}
                defaultOption={{ label: "Unassigned", value: "Unassigned" }}
                placeholder="Select"
                enableValidation={false}
                value={officer}
              />
            </div>
          </div>
        </div>
        {renderComplaintFilters()}
      </div>
    </div>
  );
};
