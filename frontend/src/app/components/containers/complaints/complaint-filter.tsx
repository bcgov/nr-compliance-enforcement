import { FC, useCallback, useContext } from "react";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import { useAppSelector } from "@hooks/hooks";
import {
  selectHwcrNatureOfComplaintCodeDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
  selectAllViolationCodeDropdown,
  selectCascadedRegion,
  selectCascadedZone,
  selectCascadedCommunity,
  selectComplaintStatusWithPendingCodeDropdown,
  selectGirTypeCodeDropdown,
  selectComplaintReceivedMethodDropdown,
  selectAllWildlifeComplaintOutcome,
  selectAllEquipmentDropdown,
  selectOutcomeActionedByOptions,
  selectAgencyExternalDropdown,
  selectCreatableComplaintTypeDropdown,
} from "@store/reducers/code-table";
import { selectOfficersByAgencyDropdownUsingPersonGuid } from "@store/reducers/officer";
import { selectDecisionTypeDropdown, selectEquipmentStatusDropdown } from "@store/reducers/code-table-selectors";
import COMPLAINT_TYPES from "@apptypes/app/complaint-types";
import { CompSelect } from "@components/common/comp-select";
import { ComplaintFilterContext } from "@providers/complaint-filter-provider";
import { ComplaintFilterPayload, clearFilter, updateFilter } from "@store/reducers/complaint-filters";
import Option from "@apptypes/app/option";
import { listActiveFilters } from "@store/reducers/app";
import UserService from "@service/user-service";
import { Roles } from "@apptypes/app/roles";
import { FilterDate } from "@components/common/filter-date";
import { ValidationMultiSelect } from "@common/validation-multiselect";
import { ParkSelect } from "@/app/components/common/park-select";
import { OUTCOMES_REQUIRING_ACTIONED_BY } from "@/app/constants/outcomes-requiring-actioned-by";
import { selectParkAreasDropdown } from "@/app/store/reducers/code-table-selectors";

type Props = {
  type: string;
};

export const ComplaintFilter: FC<Props> = ({ type }) => {
  const {
    state: {
      agency,
      complaintType,
      region,
      zone,
      community,
      park,
      area,
      officer,
      species,
      natureOfComplaint,
      violationType,
      status,
      startDate,
      endDate,
      girType,
      complaintMethod,
      actionTaken,
      outcomeAnimal,
      outcomeActionedBy,
      outcomeAnimalStartDate,
      outcomeAnimalEndDate,
      equipmentStatus,
      equipmentTypes,
    },
    dispatch,
  } = useContext(ComplaintFilterContext);

  const userAgency = UserService.getUserAgency();
  let officersByAgency = useAppSelector(selectOfficersByAgencyDropdownUsingPersonGuid(userAgency, type));
  if (officersByAgency && officersByAgency[0]?.value !== "Unassigned") {
    officersByAgency.unshift({ value: "Unassigned", label: "Unassigned" });
  }
  const natureOfComplaintTypes = useAppSelector(selectHwcrNatureOfComplaintCodeDropdown);
  const speciesTypes = useAppSelector(selectSpeciesCodeDropdown);
  // For the complaint search, inject a status type of REFERRED. This is a derived status used only on the search page.
  const statusTypes = [...useAppSelector(selectComplaintStatusWithPendingCodeDropdown)];
  if (type !== COMPLAINT_TYPES.SECTOR) {
    statusTypes.push({ value: "REFERRED", label: "Referred" });
  }

  const violationTypes = useAppSelector(
    type === COMPLAINT_TYPES.SECTOR
      ? selectAllViolationCodeDropdown
      : selectViolationCodeDropdown(agency?.value || userAgency),
  );
  const girTypes = useAppSelector(selectGirTypeCodeDropdown);
  const outcomeAnimalTypes = useAppSelector(selectAllWildlifeComplaintOutcome); //want to see inactive items in the filter
  const equipmentStatusTypes = useAppSelector(selectEquipmentStatusDropdown);
  const equipmentTypesDropdown = useAppSelector(selectAllEquipmentDropdown).filter((item) => item.isActive === true); //only display active equipment_code
  const outcomeActionedByDropdown = useAppSelector(selectOutcomeActionedByOptions);

  const regions = useAppSelector(selectCascadedRegion(region?.value, zone?.value, community?.value));
  const zones = useAppSelector(selectCascadedZone(region?.value, zone?.value, community?.value));
  const communities = useAppSelector(selectCascadedCommunity(region?.value, zone?.value, community?.value));

  const complaintMethods = useAppSelector(selectComplaintReceivedMethodDropdown);
  const decisionTypeDropdown = useAppSelector(selectDecisionTypeDropdown);

  const baseActiveFilters = useAppSelector(listActiveFilters());
  const parkAreasList = useAppSelector(selectParkAreasDropdown);
  const agencyDropdown = useAppSelector(selectAgencyExternalDropdown);
  const complaintTypeDropdown = useAppSelector(selectCreatableComplaintTypeDropdown);

  // Override activeFilters for sector view
  const activeFilters =
    type === COMPLAINT_TYPES.SECTOR
      ? {
          ...baseActiveFilters,
          showRegionFilter: false,
          showZoneFilter: false,
          showOfficerFilter: false,
          showNatureComplaintFilter: true,
          showSpeciesFilter: true,
          showViolationFilter: true,
          showGirTypeFilter: true,
          showOutcomeAnimalFilter: true,
          showOutcomeActionedByFilter: true,
          showOutcomeAnimalDateFilter: true,
        }
      : baseActiveFilters;

  const setFilter = useCallback(
    (name: string, value?: Option | Date | null) => {
      let payload: ComplaintFilterPayload = { filter: name, value };
      dispatch(updateFilter(payload));
    },
    [dispatch],
  );

  const handleDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    //set the time to be end of day to ensure that we also search for records after the beginning of the selected day.
    if (start) {
      start.setHours(0, 0, 0);
      start.setMilliseconds(0);
    }
    if (end) {
      end.setHours(23, 59, 59);
      end.setMilliseconds(999);
    }

    setFilter("startDate", start);
    setFilter("endDate", end);
  };

  const handleOutcomeDateRangeChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    //set the time to be end of day to ensure that we also search for records after the beginning of the selected day.
    if (start) {
      start.setHours(0, 0, 0);
      start.setMilliseconds(0);
    }
    if (end) {
      end.setHours(23, 59, 59);
      end.setMilliseconds(999);
    }

    setFilter("outcomeAnimalStartDate", start);
    setFilter("outcomeAnimalEndDate", end);
  };

  const handleAnimalOutcomeChange = (option: Option | null) => {
    setFilter("outcomeAnimal", option);
    if (!option?.value || !OUTCOMES_REQUIRING_ACTIONED_BY.includes(option.value)) {
      setFilter("outcomeActionedBy", null);
    }
  };

  const showHWCRFilters =
    COMPLAINT_TYPES.HWCR === type || (type === COMPLAINT_TYPES.SECTOR && complaintType?.value === COMPLAINT_TYPES.HWCR);
  const showERSFilters =
    COMPLAINT_TYPES.ERS === type || (type === COMPLAINT_TYPES.SECTOR && complaintType?.value === COMPLAINT_TYPES.ERS);
  const showGIRFilters =
    COMPLAINT_TYPES.GIR === type || (type === COMPLAINT_TYPES.SECTOR && complaintType?.value === COMPLAINT_TYPES.GIR);

  ///--
  /// Render out the filter drawer by the complaint type passed from the parent complaint component
  /// Each type of compplaint needs to have its own unique second row of filters specified
  ///--
  const renderComplaintFilters = (): JSX.Element => {
    return (
      <div className="comp-filter-container">
        {showHWCRFilters &&
          activeFilters.showNatureComplaintFilter &&
          activeFilters.showSpeciesFilter && ( // wildlife only filter
            <>
              <div id="comp-filter-nature-of-complaint-id">
                <label htmlFor="nature-of-complaint-select-id">Nature of complaint</label>
                <div className="filter-select-padding">
                  <CompSelect
                    id="nature-of-complaint-select-id"
                    showInactive={true}
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
                    isClearable={true}
                  />
                </div>
              </div>

              <div id="comp-species-filter-id">
                <label htmlFor="species-select-id">Species</label>
                <div className="filter-select-padding">
                  <CompSelect
                    id="species-select-id"
                    showInactive={true}
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
                    isClearable={true}
                  />
                </div>
              </div>
            </>
          )}

        {showERSFilters &&
          activeFilters.showViolationFilter && ( // ERS only filter
            <div id="comp-filter-violation-id">
              {/* <!-- violation types --> */}
              <label htmlFor="violation-type-select-id">Violation type</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="violation-type-select-id"
                  showInactive={true}
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
                  isClearable={true}
                />
              </div>
            </div>
          )}

        {showGIRFilters &&
          activeFilters.showGirTypeFilter && ( // GIR only filter
            <div id="comp-filter-gir-id">
              <label htmlFor="gir-type-select-id">GIR type</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="gir-type-select-id"
                  showInactive={true}
                  classNamePrefix="comp-select"
                  onChange={(option) => {
                    setFilter("girType", option);
                  }}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={girTypes}
                  placeholder="Select"
                  enableValidation={false}
                  value={girType}
                  isClearable={true}
                />
              </div>
            </div>
          )}

        {activeFilters.showDateFilter && (
          <FilterDate
            id="comp-filter-date-id"
            label="Date logged"
            startDate={startDate}
            endDate={endDate}
            handleDateChange={handleDateRangeChange}
          />
        )}

        {activeFilters.showStatusFilter && (
          <div id="comp-filter-status-id">
            <label htmlFor="status-select-id">Status</label>
            <div className="filter-select-padding">
              <CompSelect
                id="status-select-id"
                showInactive={true}
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
                isClearable={true}
              />
            </div>
          </div>
        )}

        {showERSFilters && activeFilters.showMethodFilter && (
          <div id="comp-filter-complaint-method-id">
            <label htmlFor="complaint-method-select-id">Complaint method</label>
            <div className="filter-select-padding">
              <CompSelect
                id="complaint-method-select-id"
                showInactive={true}
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("complaintMethod", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={complaintMethods}
                placeholder="Select"
                enableValidation={false}
                value={complaintMethod}
                isClearable={true}
              />
            </div>
          </div>
        )}

        {UserService.hasRole(Roles.CEEB) && type !== COMPLAINT_TYPES.SECTOR && (
          <div id="comp-filter-action-taken-id">
            <label htmlFor="action-taken-select-id">Action taken</label>
            <div className="filter-select-padding">
              <CompSelect
                id="action-taken-select-id"
                showInactive={true}
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("actionTaken", option);
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={decisionTypeDropdown}
                placeholder="Select"
                enableValidation={false}
                value={actionTaken}
                isClearable={true}
              />
            </div>
          </div>
        )}

        {showHWCRFilters && activeFilters.showOutcomeAnimalFilter && (
          <div id="comp-filter-outcome-id">
            <label htmlFor="status-select-id">Outcome by animal</label>
            <div className="filter-select-padding">
              <CompSelect
                id="status-select-id"
                showInactive={true}
                classNamePrefix="comp-select"
                onChange={(option) => {
                  handleAnimalOutcomeChange(option);
                }}
                classNames={{
                  menu: () => "top-layer-select outcome-animal-select",
                }}
                options={outcomeAnimalTypes}
                placeholder="Select"
                enableValidation={false}
                value={outcomeAnimal}
                isClearable={true}
              />
            </div>
          </div>
        )}

        {showHWCRFilters &&
          activeFilters.showOutcomeActionedByFilter &&
          outcomeAnimal &&
          OUTCOMES_REQUIRING_ACTIONED_BY.includes(outcomeAnimal.value) && (
            <div id="comp-filter-outcome-actioned-id">
              <label htmlFor="outcome-actioned-by-id">Outcome actioned by</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="outcome-actioned-by-id"
                  showInactive={true}
                  classNamePrefix="comp-select"
                  onChange={(option) => {
                    setFilter("outcomeActionedBy", option);
                  }}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={outcomeActionedByDropdown}
                  placeholder="Select"
                  enableValidation={false}
                  value={outcomeActionedBy}
                  isClearable={true}
                />
              </div>
            </div>
          )}

        {showHWCRFilters && activeFilters.showOutcomeAnimalDateFilter && (
          <FilterDate
            id="comp-filter-outcome-date-id"
            label="Outcome date"
            startDate={outcomeAnimalStartDate}
            endDate={outcomeAnimalEndDate}
            handleDateChange={handleOutcomeDateRangeChange}
          />
        )}

        {showHWCRFilters && (
          <div id="comp-filter-equipment-status-id">
            <label htmlFor="status-select-id">Equipment status</label>
            <div className="filter-select-padding">
              <CompSelect
                id="status-select-id"
                showInactive={true}
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("equipmentStatus", option);
                  //when filter equimentStatus removed -> remove filter equipmentTypes too
                  if (option === null) {
                    dispatch(clearFilter("equipmentTypes"));
                  }
                }}
                classNames={{
                  menu: () => "top-layer-select",
                }}
                options={equipmentStatusTypes}
                placeholder="Select"
                enableValidation={false}
                value={equipmentStatus}
                isClearable={true}
              />
            </div>
          </div>
        )}

        {showHWCRFilters && (
          <div id="comp-filter-equipment-type-id">
            <label htmlFor="status-select-id">Equipment type(s)</label>
            <div className="filter-select-padding">
              <ValidationMultiSelect
                className="comp-details-input"
                options={equipmentTypesDropdown}
                placeholder="Select"
                id="equipment-types-id"
                classNamePrefix="comp-select"
                onChange={(option: Option) => {
                  setFilter("equipmentTypes", option);
                }}
                errMsg={""}
                values={equipmentTypes}
                isDisabled={equipmentStatus === null}
                isClearable={true}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="collapsible-complaints-list-filter-id">
      <div>
        {/* props */}
        <div className="comp-filter-container">
          {/* <!-- tombstone --> */}
          {activeFilters.showRegionFilter && (
            <div id="comp-filter-region-id">
              {/* <!-- region --> */}
              <label htmlFor="region-select-filter-id">Region</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="region-select-filter-id"
                  showInactive={true}
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
                  isClearable={true}
                />
              </div>
            </div>
          )}
          {activeFilters.showZoneFilter && (
            <div id="comp-filter-zone-id">
              <label htmlFor="zone-select-id">Zone</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="zone-select-id"
                  showInactive={true}
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
                  isClearable={true}
                />
              </div>
            </div>
          )}

          {activeFilters.showCommunityFilter && (
            <div id="comp-filter-community-id">
              <label htmlFor="community-select-id">Community</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="community-select-id"
                  showInactive={true}
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
                  isClearable={true}
                />
              </div>
            </div>
          )}

          {activeFilters.showParkFilter && type !== COMPLAINT_TYPES.SECTOR && (
            <>
              <div id="comp-filter-area-id">
                <label htmlFor="community-select-id">Area</label>
                <div className="filter-select-padding">
                  <CompSelect
                    id="area-select-id"
                    showInactive={true}
                    classNamePrefix="comp-select"
                    onChange={(option) => {
                      setFilter("area", option);
                    }}
                    classNames={{
                      menu: () => "top-layer-select",
                    }}
                    options={parkAreasList}
                    placeholder="Select"
                    enableValidation={false}
                    value={area}
                    isClearable={true}
                  />
                </div>
              </div>
              <div id="comp-filter-park-id">
                <label htmlFor="park-select-id">Park</label>
                <div className="filter-select-padding">
                  <ParkSelect
                    id={`comp-details-park-${park?.value || "none"}`}
                    initialParkGuid={park?.value}
                    isInEdit={true}
                    onChange={(option) => {
                      setFilter("park", option);
                    }}
                  />
                </div>
              </div>
            </>
          )}
          {activeFilters.showOfficerFilter && (
            <div id="comp-filter-officer-id">
              <label htmlFor="officer-select-id">Officer assigned</label>
              <div className="filter-select-padding">
                <CompSelect
                  id="officer-select-id"
                  showInactive={true}
                  classNamePrefix="comp-select"
                  onChange={(option) => {
                    setFilter("officer", option);
                  }}
                  classNames={{
                    menu: () => "top-layer-select",
                  }}
                  options={officersByAgency}
                  defaultOption={{ label: "Unassigned", value: "Unassigned" }}
                  placeholder="Select"
                  enableValidation={false}
                  value={officer}
                  isClearable={true}
                />
              </div>
            </div>
          )}
          {type === COMPLAINT_TYPES.SECTOR && (
            <>
              <div id="comp-filter-agency-id">
                <label htmlFor="agency-select-filter-id">Agency</label>
                <div className="filter-select-padding">
                  <CompSelect
                    id="agency-select-filter-id"
                    showInactive={true}
                    classNamePrefix="comp-select"
                    onChange={(option) => {
                      setFilter("agency", option);
                    }}
                    classNames={{
                      menu: () => "top-layer-select",
                    }}
                    options={agencyDropdown}
                    placeholder="Select"
                    enableValidation={false}
                    value={agency}
                    isClearable={true}
                  />
                </div>
              </div>
              <div id="comp-filter-complaint-type-id">
                <label htmlFor="complaint-type-select-filter-id">Complaint type</label>
                <div className="filter-select-padding">
                  <CompSelect
                    id="complaint-type-select-filter-id"
                    showInactive={false}
                    classNamePrefix="comp-select"
                    onChange={(option) => {
                      setFilter("complaintType", option);
                      // Clear type-specific filters when complaint type changes
                      if (option?.value !== COMPLAINT_TYPES.HWCR) {
                        setFilter("natureOfComplaint", null);
                        setFilter("species", null);
                      }
                      if (option?.value !== COMPLAINT_TYPES.ERS) {
                        setFilter("violationType", null);
                      }
                      if (option?.value !== COMPLAINT_TYPES.GIR) {
                        setFilter("girType", null);
                      }
                    }}
                    classNames={{
                      menu: () => "top-layer-select",
                    }}
                    options={complaintTypeDropdown}
                    placeholder="Select"
                    enableValidation={false}
                    value={complaintType}
                    isClearable={true}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {renderComplaintFilters()}
      </div>
    </div>
  );
};
