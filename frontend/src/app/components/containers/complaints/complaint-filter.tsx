import { FC, useCallback, useContext } from "react";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import "../../../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.css";
import { useAppSelector } from "@hooks/hooks";
import {
  selectHwcrNatureOfComplaintCodeDropdown,
  selectSpeciesCodeDropdown,
  selectViolationCodeDropdown,
  selectCascadedRegion,
  selectCascadedZone,
  selectCascadedCommunity,
  selectComplaintStatusWithPendingCodeDropdown,
  selectGirTypeCodeDropdown,
  selectComplaintReceivedMethodDropdown,
  selectAllWildlifeComplaintOutcome,
  selectAllEquipmentDropdown,
  selectOutcomeActionedByOptions,
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
import { Park } from "@/app/components/common/park";
import { OUTCOMES_REQUIRING_ACTIONED_BY } from "@/app/constants/outcomes-requiring-actioned-by";

type Props = {
  type: string;
};

export const ComplaintFilter: FC<Props> = ({ type }) => {
  const {
    state: {
      region,
      zone,
      community,
      park,
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

  const agency = UserService.getUserAgency();
  let officersByAgency = useAppSelector(selectOfficersByAgencyDropdownUsingPersonGuid(agency, type));
  if (officersByAgency && officersByAgency[0]?.value !== "Unassigned") {
    officersByAgency.unshift({ value: "Unassigned", label: "Unassigned" });
  }
  const natureOfComplaintTypes = useAppSelector(selectHwcrNatureOfComplaintCodeDropdown);
  const speciesTypes = useAppSelector(selectSpeciesCodeDropdown);
  // For the complaint search, inject a status type of REFERRED. This is a derived status used only on the search page.
  const statusTypes = [
    ...useAppSelector(selectComplaintStatusWithPendingCodeDropdown),
    { value: "REFERRED", label: "Referred" },
  ];

  const violationTypes = useAppSelector(selectViolationCodeDropdown(agency));
  const girTypes = useAppSelector(selectGirTypeCodeDropdown);
  const outcomeAnimalTypes = useAppSelector(selectAllWildlifeComplaintOutcome); //want to see inactive items in the filter
  const equipmentStatusTypes = useAppSelector(selectEquipmentStatusDropdown);
  const equipmentTypesDropdown = useAppSelector(selectAllEquipmentDropdown).filter((item) => item.isActive === true); //only display active equipment_code
  const outcomeActionedByOptions = useAppSelector(selectOutcomeActionedByOptions);

  const regions = useAppSelector(selectCascadedRegion(region?.value, zone?.value, community?.value));
  const zones = useAppSelector(selectCascadedZone(region?.value, zone?.value, community?.value));
  const communities = useAppSelector(selectCascadedCommunity(region?.value, zone?.value, community?.value));

  const complaintMethods = useAppSelector(selectComplaintReceivedMethodDropdown);
  const decisionTypeOptions = useAppSelector(selectDecisionTypeDropdown);

  const activeFilters = useAppSelector(listActiveFilters());

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

  ///--
  /// Render out the filter drawer by the complaint type passed from the parent complaint component
  /// Each type of compplaint needs to have its own unique second row of filters specified
  ///--
  const renderComplaintFilters = (): JSX.Element => {
    return (
      <div className="comp-filter-container">
        {COMPLAINT_TYPES.HWCR === type &&
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

        {COMPLAINT_TYPES.ERS === type &&
          activeFilters.showViolationFilter && ( // wildlife only filter
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

        {COMPLAINT_TYPES.GIR === type &&
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

        {COMPLAINT_TYPES.ERS === type && activeFilters.showMethodFilter && (
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

        {UserService.hasRole(Roles.CEEB) && (
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
                options={decisionTypeOptions}
                placeholder="Select"
                enableValidation={false}
                value={actionTaken}
                isClearable={true}
              />
            </div>
          </div>
        )}

        {COMPLAINT_TYPES.HWCR === type && activeFilters.showOutcomeAnimalFilter && (
          <div id="comp-filter-status-id">
            <label htmlFor="status-select-id">Outcome by animal</label>
            <div className="filter-select-padding">
              <CompSelect
                id="status-select-id"
                showInactive={true}
                classNamePrefix="comp-select"
                onChange={(option) => {
                  setFilter("outcomeAnimal", option);
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

        {COMPLAINT_TYPES.HWCR === type &&
          activeFilters.showOutcomeActionedByFilter &&
          outcomeAnimal &&
          OUTCOMES_REQUIRING_ACTIONED_BY.includes(outcomeAnimal.value) && (
            <div id="comp-filter-status-id">
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
                  options={outcomeActionedByOptions}
                  placeholder="Select"
                  enableValidation={false}
                  value={outcomeActionedBy}
                  isClearable={true}
                />
              </div>
            </div>
          )}

        {COMPLAINT_TYPES.HWCR === type && activeFilters.showOutcomeAnimalDateFilter && (
          <FilterDate
            id="comp-filter-outcome-date-id"
            label="Outcome date"
            startDate={outcomeAnimalStartDate}
            endDate={outcomeAnimalEndDate}
            handleDateChange={handleOutcomeDateRangeChange}
          />
        )}

        {COMPLAINT_TYPES.HWCR === type && (
          <div id="comp-filter-status-id">
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

        {COMPLAINT_TYPES.HWCR === type && (
          <div id="comp-filter-status-id">
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

          {activeFilters.showParkFilter && (
            <div id="comp-filter-park-id">
              <label htmlFor="park-select-id">Park</label>
              <div className="filter-select-padding">
                <Park
                  id={`comp-details-park-${park}`}
                  initialParkGuid={park}
                  isInEdit={true}
                  onChange={(option) => {
                    setFilter("park", option);
                  }}
                />
              </div>
            </div>
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
        </div>
        {renderComplaintFilters()}
      </div>
    </div>
  );
};
