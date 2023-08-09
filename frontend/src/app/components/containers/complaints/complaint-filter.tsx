import { FC } from "react";
import Select from "react-select";
import { useAppSelector } from "../../../hooks/hooks";
import { selectCodeTable } from "../../../store/reducers/code-table";
import {  selectOfficersDropdown } from "../../../store/reducers/officer";

type Props = {};

export const ComplaintFilter: FC = () => {
  const regions = useAppSelector(selectCodeTable("regions"));
  const zones = useAppSelector(selectCodeTable("zones"));
  const communities = useAppSelector(selectCodeTable("communities"));
  const officers = useAppSelector(selectOfficersDropdown);
  const natureOfComplaintTypes = useAppSelector(
    selectCodeTable("wildlifeNatureOfComplaintCodes")
  );
  const species = useAppSelector(selectCodeTable("speciesCodes"));
  const statusTypes = useAppSelector(selectCodeTable("complaintStatusCodes"));
  const violationTypes = useAppSelector(selectCodeTable("violationCodes"));

  return (
    <div className="collapsible" id="collapsible-complaints-list-filter-id">
      <div>
        {/* props */}
        <div className="content filter-container">
          {/* <!-- tombstone --> */}
          <div className="comp-filter-left" id="comp-filter-region-id">
            {/* <!-- region --> */}
            <div className="comp-filter-label">Region</div>
            <div className="filter-select-padding">
              <Select
                options={regions}
                // onChange={handleRegionFilter}
                placeholder="Select"
                classNamePrefix="comp-select"
                // value={regionCodeFilter}
              />
            </div>
          </div>
          {/* <!-- zones --> */}
          <div className="comp-filter" id="comp-filter-zone-id">
            <div className="comp-filter-label">Zone</div>
            <div className="filter-select-padding">
              <Select
                options={zones}
                // onChange={handleZoneFilter}
                placeholder="Select"
                classNamePrefix="comp-select"
                // value={zoneCodeFilter}
              />
            </div>
          </div>

          {/* <!-- communities --> */}
          <div className="comp-filter" id="comp-filter-community-id">
            <div className="comp-filter-label">Community</div>
            <div className="filter-select-padding">
              <Select
                options={communities}
                //   onChange={handleAreaFilter}
                placeholder="Select"
                classNamePrefix="comp-select"
                //   value={areaCodeFilter}
              />
            </div>
          </div>

          {/* <!-- officers --> */}
          <div className="comp-filter" id="comp-filter-officer-id">
            <div className="comp-filter-label">Officer Assigned</div>
            <div className="filter-select-padding">
              <Select
                options={officers}
                // onChange={handleOfficerFilter}
                placeholder="Select"
                classNamePrefix="comp-select"
                // value={officerFilter}
              />
            </div>
          </div>
          <div className="clear-left-float"></div>
        </div>
      </div>
    </div>
  );
};
