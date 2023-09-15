import { FC } from "react";
import { Table } from "react-bootstrap";
import carets from "../../../../../assets/images/table-carets.png";

type Props = {
    handleSort: Function,
}

export const AllegationComplaintTableHeader: FC<Props>  = ({ handleSort }) => {

    return (
    <Table className="comp-table-header">
        <thead>
            <tr className="row">
                <th className="comp-small-cell comp-header-cell comp-top-left comp-cell-left">
                    <div className="comp-header-label">
                        Incident#
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("complaint_identifier")}>
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-small-cell comp-header-cell">
                    <div className="comp-header-label">
                        Date/Time
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("incident_reported_datetime")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-violation-cell comp-header-cell">
                    <div className="comp-header-label">
                        Violation Type
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("violation_code")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-in-progress-cell comp-header-cell">
                    <div className="comp-header-label">
                        Violation In Progress
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("in_progress_ind")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-area-cell comp-header-cell">
                    <div className="comp-header-label">
                        Community
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("geo_organization_unit_code")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-location-cell comp-header-cell">
                    <div className="comp-header-label">
                        Location/Address
                    </div>
                </th>
                <th className="comp-medium-cell comp-header-cell">
                    <div className="comp-header-label">
                        Officer Assigned
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("last_name")}>
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-status-cell comp-header-cell">
                    <div className="comp-header-label">
                        Status
                    </div>
                    <div className="comp-header-caret" onClick={() => handleSort("complaint_status_code")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-last-updated-cell comp-header-cell">
                    <div className="comp-header-label">
                        Last Updated
                    </div>
                    <div id="sort_by_update_timestamp_id" className="comp-header-caret" onClick={() => handleSort("update_timestamp")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-ellipsis-cell comp-header-cell comp-top-right">
                    <div className="comp-header-label">
                        <i className="bi bi-three-dots-vertical"></i>
                    </div>
                </th>
            </tr>
        </thead>
    </Table>
    );
  };