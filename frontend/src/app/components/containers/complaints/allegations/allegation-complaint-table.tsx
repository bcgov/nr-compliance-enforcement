import { FC, useEffect } from "react";
import { format } from 'date-fns';
import { Row, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getAllegationComplaints, allegationComplaints } from "../../../../store/reducers/allegation-complaint"

type Props = {
    sortColumn: string,
    sortOrder: string,
}

export const AllegationComplaintTable: FC<Props>  = ({ sortColumn, sortOrder }) => {
    const dispatch = useAppDispatch();

    const allegationComplaintsJson = useAppSelector(allegationComplaints);

    useEffect(() => {
            dispatch(getAllegationComplaints(sortColumn, sortOrder));
  }, [dispatch])


    return (
        <Table id="comp-table" className="comp-table">
            <tbody>
                {allegationComplaintsJson.map((val, key, {length}) => {
                    const complaint_identifier = val.complaint_identifier.complaint_identifier;
                    const incident_reported_datetime = val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : "";
                    const violation_code = val.violation_code != null ? val.violation_code.long_description : "";
                    const in_progress_class = (String)(val.in_progress_ind) === 'true' ? "btn btn-primary comp-in-progress-btn" : "btn btn-primary comp-in-progress-btn btn-hidden";
                    const in_progress_ind = (String)(val.in_progress_ind) === 'true' ? "In Progress" : "";
                    const geo_organization_unit_code = val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : "";
                    const location_summary = val.complaint_identifier.location_summary_text;
                    const statusClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-status-closed-btn' : 'btn btn-primary comp-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const update_date = val.complaint_identifier.update_timestamp != null ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : "";
                    //alternate behaviour for last row for alternate borders and radius'
                    if(length - 1 === key)
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-small-cell comp-cell comp-cell-bottom comp-cell-left comp-bottom-left">{complaint_identifier}</td>
                                <td className="comp-small-cell comp-cell-bottom comp-cell">{incident_reported_datetime}</td>
                                <td className="comp-violation-cell comp-cell comp-cell-bottom">{violation_code}</td>
                                <td className="comp-in-progress-cell comp-cell comp-cell-bottom">
                                    <button type="button" className={in_progress_class}>{in_progress_ind}</button>
                                </td>
                                <td className="comp-area-cell comp-cell comp-cell-bottom">{geo_organization_unit_code}</td>
                                <td className="comp-location-cell comp-cell comp-cell-bottom">{location_summary}</td>
                                <td className="comp-medium-cell comp-cell comp-cell-bottom">
                                </td>
                                <td className="comp-status-cell comp-cell comp-cell-bottom">
                                    <button type="button" className={statusClass}>{status}</button>
                                </td>
                                <td className="comp-last-updated-cell comp-cell comp-cell-bottom comp-bottom-right">{update_date}</td>
                            </Row>
                        )
                    }
                    else
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-small-cell comp-cell comp-cell-left">{complaint_identifier}</td>
                                <td className="comp-small-cell comp-cell">{incident_reported_datetime}</td>
                                <td className="comp-violation-cell comp-cell">{violation_code}</td>
                                <td className="comp-in-progress-cell comp-cell">
                                    <button type="button" className={in_progress_class}>{in_progress_ind}</button>
                                </td>
                                <td className="comp-area-cell comp-cell">{geo_organization_unit_code}</td>
                                <td className="comp-location-cell comp-cell">{location_summary}</td>
                                <td className="comp-medium-cell comp-cell">
                                </td>
                                <td className="comp-status-cell comp-cell">
                                <button type="button" className={statusClass}>{status}</button>
                                </td>
                                <td className="comp-last-updated-cell comp-cell">{update_date}</td>
                            </Row>
                        )
                    }
                    })}
            </tbody>
        </Table>
    );
  };