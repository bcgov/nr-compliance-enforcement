import { FC, useEffect } from "react";
import { format } from 'date-fns';
import { Row, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getHwcrComplaints, hwcrComplaints } from "../../../../store/reducers/hwcr-complaints"
import { useNavigate } from "react-router-dom";
import ComplaintTypes from "../../../../types/app/complaint-types";

export const HwcrComplaintTable: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const hwcrComplaintsJson = useAppSelector(hwcrComplaints);

    useEffect(() => {
            dispatch(getHwcrComplaints());
  }, [dispatch])


  const handleComplaintClick = (
    e: any, //-- this needs to be updated to use the correct type when updating <Row> to <tr>
    id: string
  ) => {
    e.preventDefault();

    navigate(`/complaint/${ComplaintTypes.HWCR}/${id}`);
  };

    return (
        <Table id="comp-table" className="comp-table">
            <tbody>
                {hwcrComplaintsJson.map((val, key, {length}) => {
                    const complaint_identifier = val.complaint_identifier.complaint_identifier;
                    const incident_reported_datetime = val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : "";
                    const hwcr_complaint_nature_code = val.hwcr_complaint_nature_code != null ? val.hwcr_complaint_nature_code.long_description : "";
                    const species = val.species_code.short_description;
                    const geo_organization_unit_code = val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : "";
                    const location_summary = val.complaint_identifier.location_summary_text;
                    const statusClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-status-closed-btn' : 'btn btn-primary comp-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const update_date = val.complaint_identifier.update_timestamp != null ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : "";
                    //alternate behaviour for last row for alternate borders and radius'
                    if(length - 1 === key)
                    {
                        return (
                            <Row key={key} onClick={(event) =>
                                handleComplaintClick(event, complaint_identifier)
                              }>
                                <td className="comp-small-cell comp-cell comp-cell-bottom comp-cell-left comp-bottom-left">{complaint_identifier}</td>
                                <td className="comp-small-cell comp-cell-bottom comp-cell">{incident_reported_datetime}</td>
                                <td className="comp-nature-complaint-cell comp-cell comp-cell-bottom">{hwcr_complaint_nature_code}</td>
                                <td className="comp-medium-cell comp-cell comp-cell-bottom">
                                    <button type="button" className="btn btn-primary comp-species-btn">{species}</button>
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
                            <Row key={key} onClick={(event) =>
                                handleComplaintClick(event, complaint_identifier)
                              }>
                                <td className="comp-small-cell comp-cell comp-cell-left">{complaint_identifier}</td>
                                <td className="comp-small-cell comp-cell">{incident_reported_datetime}</td>
                                <td className="comp-nature-complaint-cell comp-cell">{hwcr_complaint_nature_code}</td>
                                <td className="comp-medium-cell comp-cell">
                                    <button type="button" className="btn btn-primary comp-species-btn">{species}</button>
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