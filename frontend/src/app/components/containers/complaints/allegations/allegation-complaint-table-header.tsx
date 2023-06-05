import { FC } from "react";
import { Row, Table } from "react-bootstrap";
import carets from "../../../../../assets/images/table-carets.png";

type Props = {
    handleSort: Function,
}

export const AllegationComplaintTableHeader: FC<Props>  = ({ handleSort}) => {

    return (
    <Table className="comp-table-header">
        <thead>
            <Row>
                <th className="comp-small-cell comp-header-cell comp-top-left comp-cell-left">
                    <div className="comp-header-label">
                        Incident#
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort"  onClick={handleSort("complaint_identifer")}/>
                    </div>
                </th>
                <th className="comp-small-cell comp-header-cell">
                    <div className="comp-header-label">
                        Date/Time
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("incident_reported_datetime")}/>
                    </div>
                </th>
                <th className="comp-violation-cell comp-header-cell">
                    <div className="comp-header-label">
                        Violation Type
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("violation_code")} />
                    </div>
                </th>
                <th className="comp-in-progress-cell comp-header-cell">
                    <div className="comp-header-label">
                        Violation In Progress
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("in_progress_ind")}/>
                    </div>
                </th>
                <th className="comp-area-cell comp-header-cell">
                    <div className="comp-header-label">
                        Community
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("geo_organization_unit_code")}/>
                    </div>
                </th>
                <th className="comp-location-cell comp-header-cell">
                    <div className="comp-header-label">
                        Location/Address
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("location_summary_text")}/>
                    </div>
                </th>
                <th className="comp-medium-cell comp-header-cell">
                    <div className="comp-header-label">
                        Officer Assigned
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-status-cell comp-header-cell">
                    <div className="comp-header-label">
                        Status
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("complaint_status_code")}/>
                    </div>
                </th>
                <th className="comp-last-updated-cell comp-header-cell comp-top-right">
                    <div className="comp-header-label">
                        Last Updated
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("update_timestamp")}/>
                    </div>
                </th>
            </Row>
        </thead>
    </Table>
    );
  };