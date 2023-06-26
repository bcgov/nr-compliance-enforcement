import { FC, useEffect } from "react";
import { format } from 'date-fns';
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getAllegationComplaints, allegationComplaints } from "../../../../store/reducers/allegation-complaint"
import ComplaintTypes from "../../../../types/app/complaint-types";
import { useNavigate } from "react-router-dom";
import ComplaintEllipsisPopover from "../complaint-ellipsis-popover";
import ComplaintType from "../../../../constants/complaint-types";
import Option from "../../../../types/app/option";

type Props = {
    sortColumn: string,
    sortOrder: string,
    violationFilter: Option | null,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    complaintStatusFilter: Option | null,
}
export const AllegationComplaintTable: FC<Props>  = ({ sortColumn, sortOrder, violationFilter, startDateFilter, endDateFilter, complaintStatusFilter }) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const allegationComplaintsJson = useAppSelector(allegationComplaints);


    useEffect(() => {
            dispatch(getAllegationComplaints(sortColumn, sortOrder, violationFilter, startDateFilter, endDateFilter, complaintStatusFilter));
  }, [dispatch, sortColumn, sortOrder, violationFilter, startDateFilter, endDateFilter, complaintStatusFilter])


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
                    const geoOrganizationUnitCode = val.complaint_identifier.cos_geo_org_unit ? val.complaint_identifier.cos_geo_org_unit.area_name : "";
                    const locationSummary = val.complaint_identifier.location_summary_text;
                    const statusButtonClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-status-closed-btn' : 'btn btn-primary comp-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const updateDate = Date.parse(val.complaint_identifier.update_timestamp) >= Date.parse(val.update_timestamp) ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : format(Date.parse(val.update_timestamp), 'yyyy/MM/dd kk:mm:ss');
                    const assigned_ind = val.complaint_identifier.person_complaint_xref.length > 0 && val.complaint_identifier.person_complaint_xref[0].active_ind;
                    const firstName = val.complaint_identifier.person_complaint_xref[0]?.person_guid?.first_name;
                    const lastName = val.complaint_identifier.person_complaint_xref[0]?.person_guid?.last_name;
                    const firstInitial = firstName?.length > 0 ? firstName.substring(0,1) : "";
                    const lastInitial = lastName?.length > 0 ? lastName.substring(0,1) : "";
                    const initials = firstInitial + lastInitial;
                    const displayName = firstInitial.length > 0 ? firstInitial + ". " + lastName : lastName;
                    const guid = val.allegation_complaint_guid;
                    const zone = val.complaint_identifier.cos_geo_org_unit.zone_code;

                        return (
                            <tr key={`allegation-complaint-${complaintIdentifier}`}>
                                <td className="comp-small-cell comp-cell comp-cell-left" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{complaintIdentifier}</td>
                                <td className="comp-small-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{incidentReportedDatetime}</td>
                                <td className="comp-violation-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{violationCode}</td>
                                <td className="comp-in-progress-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                    <button type="button" className={inProgressButtonClass}>{inProgressInd}</button>
                                </td>
                                <td className="comp-area-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{geoOrganizationUnitCode} </td>
                                <td className="comp-location-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{locationSummary} </td>
                                <td className="comp-medium-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                    <div data-initials-listview={initials} className="comp-profile-avatar"></div> {displayName}
                                </td>
                                <td className="comp-status-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                    <button type="button" className={statusButtonClass}>{status}</button>
                                </td>
                                <td className="comp-last-updated-cell comp-cell">{updateDate}</td>
                                <ComplaintEllipsisPopover complaint_identifier={complaintIdentifier} complaint_type={ComplaintType.ALLEGATION_COMPLAINT} sortColumn={sortColumn} sortOrder={sortOrder} natureOfComplaintFilter={null} speciesCodeFilter={null} violationFilter={violationFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter}></ComplaintEllipsisPopover>

                            </tr>
                        )
                    })}
            </tbody>
        </Table>
    );
  };