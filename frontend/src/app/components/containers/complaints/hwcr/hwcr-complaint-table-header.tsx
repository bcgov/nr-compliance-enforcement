import { FC } from "react";
import { Row, Table } from "react-bootstrap";
import carets from "../../../../../assets/images/table-carets.png";

type Props = {
    handleSort: Function,
}

export const HwcrComplaintTableHeader: FC<Props>  = ({ handleSort }) => {
    return (
    <Table className="comp-table-header">
        <thead>
            <Row>
                <th className="comp-small-cell comp-header-cell comp-top-left comp-cell-left">
                    <div className="comp-header-label">
                        Incident#
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("complaint_identifier")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-small-cell comp-header-cell">
                    <div className="comp-header-label">
                        Date/Time
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("incident_reported_datetime")} >
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-nature-complaint-cell comp-header-cell">
                    <div className="comp-header-label">
                        Nature of Complaint
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("hwcr_complaint_nature_code")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-medium-cell comp-header-cell">
                    <div className="comp-header-label">
                        Species
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("species_code")}>
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-area-cell comp-header-cell">
                    <div className="comp-header-label">
                        Community
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("geo_organization_unit_code")} >
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-location-cell comp-header-cell">
                    <div className="comp-header-label">
                        Location/Address
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("location_summary_text")} >
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-medium-cell comp-header-cell">
                    <div className="comp-header-label">
                        Officer Assigned
                    </div>
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-status-cell comp-header-cell">
                    <div className="comp-header-label">
                        Status
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("complaint_status_code")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
                <th className="comp-last-updated-cell comp-header-cell comp-top-right">
                    <div className="comp-header-label">
                        Last Updated
                    </div>
                    <div className="comp-header-caret" onClick={handleSort("update_timestamp")}>
                        <img src={carets} alt="sort"/>
                    </div>
                </th>
            </Row>
        </thead>
    </Table>
    );
  };