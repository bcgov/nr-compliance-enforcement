import { FC } from "react";
import { Row, Table } from "react-bootstrap";
import carets from "../../../../../assets/images/table-carets.png";

type Props = {
    handleSort: Function,
}

export const HwcrComplaintTableHeader: FC<Props>  = ({ handleSort }) => {
    return (
    <Table className="comp-hwcr-table-header">
        <thead>
            <Row>
                <th className="comp-hwcr-small-cell comp-hwcr-header-cell comp-top-left comp-hwcr-cell-left">
                    <div className="comp-hwcr-header-label">
                        Incident#
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("complaint_identifer")}/>
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-small-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Date/Time
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("incident_reported_datetime")} />
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-nature-complaint-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Nature of Complaint
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("hwcr_complaint_nature_code")}/>
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-medium-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Species
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("species_code")} />
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-area-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Community
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("geo_organization_unit_code")}  />
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-location-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Location/Address
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("location_summary_text")} />
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-medium-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Officer Assigned
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort"/>
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-status-cell comp-hwcr-header-cell">
                    <div className="comp-hwcr-header-label">
                        Status
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("complaint_status_code")}/>
>>>>>>> Stashed changes
                    </div>
                </th>
                <th className="comp-hwcr-last-updated-cell comp-hwcr-header-cell comp-top-right">
                    <div className="comp-hwcr-header-label">
                        Last Updated
                    </div>
<<<<<<< Updated upstream
                    <div className="comp-hwcr-header-caret">
                        <img src={carets} alt="sort" />
=======
                    <div className="comp-header-caret">
                        <img src={carets} alt="sort" onClick={handleSort("update_timestamp")}/>
>>>>>>> Stashed changes
                    </div>
                </th>
            </Row>
        </thead>
    </Table>
    );
  };