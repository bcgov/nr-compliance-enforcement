import { FC, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import ComplaintEllipsisPopover from "../complaint-ellipsis-popover";
import Option from "../../../../types/app/option";
import COMPLAINT_TYPES from "../../../../types/app/complaint-types";
import { getComplaints, selectWildlifeComplaints, setComplaints } from "../../../../store/reducers/complaints";
import { ComplaintFilters } from '../../../../types/complaints/complaint-filters';
import { formatDateTime } from "../../../../common/methods";

type Props = {
    sortColumn: string,
    sortOrder: string,
    regionCodeFilter: Option | null,
    zoneCodeFilter: Option | null,
    areaCodeFilter: Option | null,
    officerFilter: Option | null,
    natureOfComplaintFilter: Option | null,
    speciesCodeFilter: Option | null,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    complaintStatusFilter: Option | null,
}

export const HwcrComplaintTable: FC<Props>  = ({ sortColumn, sortOrder, regionCodeFilter, zoneCodeFilter, areaCodeFilter, officerFilter, natureOfComplaintFilter, speciesCodeFilter, startDateFilter, endDateFilter, complaintStatusFilter}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const hwcrComplaintsJson = useAppSelector(selectWildlifeComplaints);

    useEffect(() => {
      //-- when the component unmounts clear the complaint from redux
      return () => {
        dispatch(setComplaints({ type: COMPLAINT_TYPES.HWCR, data: [] }))
      };
    }, [dispatch]);

    useEffect(() => {
        const payload = {
          sortColumn,
          sortOrder,
          regionCodeFilter,
          zoneCodeFilter,
          areaCodeFilter,
          officerFilter,
          natureOfComplaintFilter,
          speciesCodeFilter,
          startDateFilter,
          endDateFilter,
          complaintStatusFilter,
        } as ComplaintFilters;
    
        dispatch(getComplaints(COMPLAINT_TYPES.HWCR, payload));
      }, [
        dispatch,
        sortColumn,
        sortOrder,
        regionCodeFilter,
        zoneCodeFilter,
        areaCodeFilter,
        officerFilter,
        natureOfComplaintFilter,
        speciesCodeFilter,
        startDateFilter,
        endDateFilter,
        complaintStatusFilter,
      ]);
    
  const handleComplaintClick = (
    e: any, //-- this needs to be updated to use the correct type when updating <Row> to <tr>
    id: string
  ) => {
    e.preventDefault();

    navigate(`/complaint/${COMPLAINT_TYPES.HWCR}/${id}`);
  };

    return (
        <Table id="comp-table" className="comp-table">
            <tbody>
                {hwcrComplaintsJson.map((val, key) => {
                    const complaintIdentifier = val.complaint_identifier.complaint_identifier;
                    const incidentReportedDatetime = formatDateTime(val.complaint_identifier.incident_reported_datetime);
                    const hwcrComplaintNatureCode = val.hwcr_complaint_nature_code != null ? val.hwcr_complaint_nature_code.long_description : "";
                    const species = val.species_code.short_description;
                    const geoOrganizationUnitCode = val.complaint_identifier.cos_geo_org_unit ? val.complaint_identifier.cos_geo_org_unit.area_name : "";
                    const locationSummary = val.complaint_identifier.location_summary_text;
                    const statusButtonClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-status-closed-btn' : 'btn btn-primary comp-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const updateDate = Date.parse(val.complaint_identifier.update_timestamp) >= Date.parse(val.update_timestamp) ? formatDateTime(val.complaint_identifier.update_timestamp) : formatDateTime(val.update_timestamp);
                    const assigned_ind = val.complaint_identifier.person_complaint_xref.length > 0 && val.complaint_identifier.person_complaint_xref[0].active_ind;
                    const firstName = val.complaint_identifier.person_complaint_xref[0]?.person_guid?.first_name;
                    const lastName = val.complaint_identifier.person_complaint_xref[0]?.person_guid?.last_name;
                    const firstInitial = firstName?.length > 0 ? firstName.substring(0,1) : "";
                    const lastInitial = lastName?.length > 0 ? lastName.substring(0,1) : "";
                    const initials = firstInitial + lastInitial;
                    const displayName = firstInitial.length > 0 ? firstInitial + ". " + lastName : lastName;
                    const zone = val.complaint_identifier.cos_geo_org_unit?.zone_code;
                    return (
                         <tr key={`hwcr-complaint-${complaintIdentifier}`} >
                            <td className="comp-small-cell comp-cell comp-cell-left" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{complaintIdentifier}</td>
                            <td className="comp-small-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{incidentReportedDatetime}</td>
                            <td className="comp-nature-complaint-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{hwcrComplaintNatureCode}</td>
                            <td className="comp-medium-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                <button type="button" className="btn btn-primary comp-species-btn">{species}</button>
                            </td>
                            <td className="comp-area-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{geoOrganizationUnitCode}</td>
                            <td className="comp-location-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{locationSummary}</td>
                            <td className="comp-medium-cell comp-cell comp-cell-assignee" onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                <div data-initials-listview={initials} className="comp-profile-avatar"></div> {displayName}
                            </td>
                            <td className="comp-status-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>
                                <button type="button" className={statusButtonClass}>{status}</button>
                            </td>
                            <td className="comp-last-updated-cell comp-cell" onClick={event => handleComplaintClick(event, complaintIdentifier)}>{updateDate}</td>
                            <ComplaintEllipsisPopover complaint_identifier={complaintIdentifier} complaint_type={COMPLAINT_TYPES.HWCR} assigned_ind={assigned_ind} zone={zone} sortColumn={sortColumn} sortOrder={sortOrder} natureOfComplaintFilter={natureOfComplaintFilter} speciesCodeFilter={speciesCodeFilter} violationFilter={null} startDateFilter={startDateFilter} endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter}></ComplaintEllipsisPopover>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    );
  };
