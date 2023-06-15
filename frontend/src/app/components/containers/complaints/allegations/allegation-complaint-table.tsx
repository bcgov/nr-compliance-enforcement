import { FC, useEffect } from "react";
import { format } from 'date-fns';
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getAllegationComplaints, allegationComplaints } from "../../../../store/reducers/allegation-complaint"
import ComplaintEllipsisPopover from "../complaint-ellipsis-popover";

type Props = {
    sortColumn: string,
    sortOrder: string,
}

export const AllegationComplaintTable: FC<Props>  = ({ sortColumn, sortOrder }) => {
    const dispatch = useAppDispatch();

    const allegationComplaintsJson = useAppSelector(allegationComplaints);

    useEffect(() => {
            dispatch(getAllegationComplaints(sortColumn, sortOrder));
  }, [dispatch, sortColumn, sortOrder])


    return (
        <Table id="comp-table" className="comp-table">
            <tbody>
                {allegationComplaintsJson.map((val, key, {length}) => {
                    const complaintIdentifier = val.complaint_identifier.complaint_identifier;
                    const incidentReportedDatetime = val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : "";
                    const violationCode = val.violation_code != null ? val.violation_code.long_description : "";
                    const inProgressButtonClass = (String)(val.in_progress_ind) === 'true' ? "btn btn-primary comp-in-progress-btn" : "btn btn-primary comp-in-progress-btn btn-hidden";
                    const inProgressInd = (String)(val.in_progress_ind) === 'true' ? "In Progress" : "";
                    const geoOrganizationUnitCode = val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : "";
                    const locationSummary = val.complaint_identifier.location_summary_text;
                    const statusButtonClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-status-closed-btn' : 'btn btn-primary comp-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const updateDate = Date.parse(val.complaint_identifier.update_timestamp) >= Date.parse(val.update_timestamp) ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : format(Date.parse(val.update_timestamp), 'yyyy/MM/dd kk:mm:ss');
                        return (
                            <tr key={"allegationComplaint" + key.toString()}>
                                <td className="comp-small-cell comp-cell comp-cell-left">{complaintIdentifier}</td>
                                <td className="comp-small-cell comp-cell">{incidentReportedDatetime}</td>
                                <td className="comp-violation-cell comp-cell">{violationCode}</td>
                                <td className="comp-in-progress-cell comp-cell">
                                    <button type="button" className={inProgressButtonClass}>{inProgressInd}</button>
                                </td>
                                <td className="comp-area-cell comp-cell">{geoOrganizationUnitCode}</td>
                                <td className="comp-location-cell comp-cell">{locationSummary}</td>
                                <td className="comp-medium-cell comp-cell">
                                </td>
                                <td className="comp-status-cell comp-cell">
                                    <button type="button" className={statusButtonClass}>{status}</button>
                                </td>
                                <td className="comp-last-updated-cell comp-cell">{updateDate}</td>
                                <ComplaintEllipsisPopover complaint_identifier={complaintIdentifier} allegatation_complaint={val}></ComplaintEllipsisPopover>
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    );
  };