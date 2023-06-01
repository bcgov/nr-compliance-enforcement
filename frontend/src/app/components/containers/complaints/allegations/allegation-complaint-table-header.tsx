import { FC } from "react";
import { Row, Table } from "react-bootstrap";
import "../../../../../assets/sass/app.scss";
import carets from "../../../../../assets/images/table-carets.png";

export const AllegationComplaintTableHeader: FC = () => {
    return (
    <Table className="comp-allegation-table-header">
        <thead>
            <Row>
                <th className="comp-allegation-small-cell comp-allegation-header-cell comp-top-left comp-allegation-cell-left">
                    <div className="comp-allegation-header-label">
                        Incident#
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-small-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        Date/Time
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-violaion-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        Violation Type
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-in-progress-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        In Progress
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-area-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        Community
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-location-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        Location/Address
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-medium-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        Officer Assigned
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-status-cell comp-allegation-header-cell">
                    <div className="comp-allegation-header-label">
                        Status
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
                <th className="comp-allegation-last-updated-cell comp-allegation-header-cell comp-top-right">
                    <div className="comp-allegation-header-label">
                        Last Updated
                    </div>
                    <div className="comp-allegation-header-caret">
                        <img src={carets} alt="sort" />
                    </div>
                </th>
            </Row>
        </thead>
    </Table>
    );
  };