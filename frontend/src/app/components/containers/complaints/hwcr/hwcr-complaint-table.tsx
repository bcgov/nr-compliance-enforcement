import { FC, useEffect } from "react";
import { format } from 'date-fns';
import { Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getHwcrComplaints, hwcrComplaints } from "../../../../store/reducers/hwcr-complaints"

type Props = {
    sortColumn: string,
    sortOrder: string,
}

const renderPopover = (id: number) => (
    <Popover id={`popover-${id}`}>
      <Popover.Title as="h3">Links</Popover.Title>
      <Popover.Content>
        <ul>
          <li>
            <a href={`https://example.com/link1?id=${id}`}>Link 1</a>
          </li>
          <li>
            <a href={`https://example.com/link2?id=${id}`}>Link 2</a>
          </li>
        </ul>
      </Popover.Content>
    </Popover>
  );

export const HwcrComplaintTable: FC<Props>  = ({ sortColumn, sortOrder }) => {
    const dispatch = useAppDispatch();

    const hwcrComplaintsJson = useAppSelector(hwcrComplaints);

    useEffect(() => {
            dispatch(getHwcrComplaints(sortColumn, sortOrder));
  }, [dispatch, sortColumn, sortOrder]);


    return (
        <Table id="comp-table" className="comp-table">
            <tbody>
                {hwcrComplaintsJson.map((val, key) => {
                    const complaintIdentifier = val.complaint_identifier.complaint_identifier;
                    const incidentReportedDatetime = val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : "";
                    const hwcrComplaintNatureCode = val.hwcr_complaint_nature_code != null ? val.hwcr_complaint_nature_code.long_description : "";
                    const species = val.species_code.short_description;
                    const geoOrganizationUnitCode = val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : "";
                    const locationSummary = val.complaint_identifier.location_summary_text;
                    const statusButtonClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-status-closed-btn' : 'btn btn-primary comp-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const updateDate = Date.parse(val.complaint_identifier.update_timestamp) >= Date.parse(val.update_timestamp) ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : format(Date.parse(val.update_timestamp), 'yyyy/MM/dd kk:mm:ss');
                    return (
                        <tr key={"hwcrComplaint" + key.toString()}>
                            <td className="comp-small-cell comp-cell comp-cell-left">{complaintIdentifier}</td>
                            <td className="comp-small-cell comp-cell">{incidentReportedDatetime}</td>
                            <td className="comp-nature-complaint-cell comp-cell">{hwcrComplaintNatureCode}</td>
                            <td className="comp-medium-cell comp-cell">
                                <button type="button" className="btn btn-primary comp-species-btn">{species}</button>
                            </td>
                            <td className="comp-area-cell comp-cell">{geoOrganizationUnitCode}</td>
                            <td className="comp-location-cell comp-cell">{locationSummary}</td>
                            <td className="comp-medium-cell comp-cell">
                            </td>
                            <td className="comp-status-cell comp-cell">
                                <button type="button" className={statusButtonClass}>{status}</button>
                            </td>
                            <td className="comp-last-updated-cell comp-cell">{updateDate}</td>
                            <td className="comp-ellipsis-cell comp-cell">
                                 <OverlayTrigger
          trigger="click"
          placement="left"
          overlay={renderPopover(val.complaint_identifier.complaint_identifier)}
        >
                                <i className="bi bi-three-dots-vertical"></i>
                            </OverlayTrigger>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    );
  };
