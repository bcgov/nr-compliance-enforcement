import { FC, useEffect } from "react";
import { format } from 'date-fns';
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getAllegationComplaints, allegationComplaints } from "../../../../store/reducers/allegation-complaint"
import ComplaintTypes from "../../../../types/app/complaint-types";
import { useNavigate } from "react-router-dom";

type Props = {
    sortColumn: string,
    sortOrder: string,
}

export const AllegationComplaintTable: FC<Props>  = ({ sortColumn, sortOrder }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allegationComplaintsJson = useAppSelector(allegationComplaints);

    useEffect(() => {
            dispatch(getAllegationComplaints(sortColumn, sortOrder));
  }, [dispatch, sortColumn, sortOrder])


  const handleComplaintClick = (
    e: any, //-- this needs to be updated to use the correct type when updating <Row> to <tr>
    id: string
  ) => {
    e.preventDefault();

    navigate(`/complaint/${ComplaintTypes.ERS}/${id}`);
  };


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
                    //alternate behaviour for last row for alternate borders and radius'
                    const complaintIdentifierClass = (length - 1 === key) ? "comp-small-cell comp-cell comp-cell-bottom comp-cell-left comp-bottom-left" : "comp-small-cell comp-cell comp-cell-left";
                    const incidentReportedDatetimeClass = (length - 1 === key) ? "comp-small-cell comp-cell-bottom comp-cell" : "comp-small-cell comp-cell";
                    const violationCodeClass = (length - 1 === key) ? "comp-violation-cell comp-cell comp-cell-bottom" : "comp-violation-cell comp-cell";
                    const inProgressIndClass = (length - 1 === key) ? "comp-in-progress-cell comp-cell comp-cell-bottom" : "comp-in-progress-cell comp-cell";
                    const geoOrganizationUnitCodeClass = (length - 1 === key) ? "comp-area-cell comp-cell comp-cell-bottom" : "comp-area-cell comp-cell";
                    const locationSummaryClass = (length - 1 === key) ? "comp-location-cell comp-cell comp-cell-bottom" : "comp-location-cell comp-cell";
                    const officerAssignedClass = (length - 1 === key) ? "comp-medium-cell comp-cell comp-cell-bottom" : "comp-medium-cell comp-cell";
                    const statusClass = (length - 1 === key) ? "comp-status-cell comp-cell comp-cell-bottom" : "comp-status-cell comp-cell";
                    const updateDateClass = (length - 1 === key) ? "comp-last-updated-cell comp-cell comp-cell-bottom comp-bottom-right" : "comp-last-updated-cell comp-cell";
                        return (
                            <tr key={`allegation-complaint-${key}`} onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                <td className={complaintIdentifierClass}>{complaintIdentifier}</td>
                                <td className={incidentReportedDatetimeClass}>{incidentReportedDatetime}</td>
                                <td className={violationCodeClass}>{violationCode}</td>
                                <td className={inProgressIndClass}>
                                    <button type="button" className={inProgressButtonClass}>{inProgressInd}</button>
                                </td>
                                <td className={geoOrganizationUnitCodeClass}>{geoOrganizationUnitCode}</td>
                                <td className={locationSummaryClass}>{locationSummary}</td>
                                <td className={officerAssignedClass}>
                                </td>
                                <td className={statusClass}>
                                    <button type="button" className={statusButtonClass}>{status}</button>
                                </td>
                                <td className={updateDateClass}>{updateDate}</td>
                            </tr>
                        )

                    })}
            </tbody>
        </Table>
    );
  };