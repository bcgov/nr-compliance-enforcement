import { FC, useEffect } from "react";
import "../../../../../assets/sass/app.scss";
import { format } from 'date-fns';
import { Row, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { getHwcrComplaints, hwcrComplaints } from "../../../../store/reducers/hwcr-complaints"

export const HwcrComplaintTable: FC = () => {
    const dispatch = useAppDispatch();

    const hwcrComplaintsArray = useAppSelector(hwcrComplaints);

    useEffect(() => {
            dispatch(getHwcrComplaints());
  }, [hwcrComplaints, dispatch])


    return (
        <Table id="comp-hwcr-table" className="comp-hwcr-table">
            <tbody>
                {hwcrComplaintsArray.map((val, key, {length}) => {
                    const complaint_identifier = val.complaint_identifier.complaint_identifier;
                    const incident_reported_datetime = val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : "";
                    const hwcr_complaint_nature_code = val.hwcr_complaint_nature_code != null ? val.hwcr_complaint_nature_code.long_description : "";
                    const species = val.species_code.short_description;
                    const geo_organization_unit_code = val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : "";
                    const location_summary = val.complaint_identifier.location_summary_text;
                    const statusClass =  val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-hwcr-status-closed-btn' : 'btn btn-primary comp-hwcr-status-open-btn';
                    const status = val.complaint_identifier.complaint_status_code.long_description;
                    const update_date = val.complaint_identifier.update_timestamp != null ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : "";
                    //alternate behaviour for last row for alternate borders and radius'
                    if(length - 1 === key)
                    {
                        return (
                            <Row key={key}>
                                <td id="comp-hwcr-id-coulmn{length}" className="comp-hwcr-small-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-hwcr-cell-left comp-bottom-left">{complaint_identifier}</td>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell-bottom comp-hwcr-cell">{incident_reported_datetime}</td>
                                <td className="comp-hwcr-nature-complaint-cell comp-hwcr-cell comp-hwcr-cell-bottom">{hwcr_complaint_nature_code}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <button type="button" className="btn btn-primary comp-hwcr-species-btn">{species}</button>
                                </td>
                                <td className="comp-hwcr-area-cell comp-hwcr-cell comp-hwcr-cell-bottom">{geo_organization_unit_code}</td>
                                <td className="comp-hwcr-location-cell comp-hwcr-cell comp-hwcr-cell-bottom">{location_summary}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    Unassigned
                                </td>
                                <td className="comp-hwcr-status-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <button type="button" className={statusClass}>{status}</button>
                                </td>
                                <td className="comp-hwcr-last-updated-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-bottom-right">{update_date}</td>
                            </Row>
                        )
                    }
                    else
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell comp-hwcr-cell-left">{complaint_identifier}</td>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell">{incident_reported_datetime}</td>
                                <td className="comp-hwcr-nature-complaint-cell comp-hwcr-cell">{hwcr_complaint_nature_code}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell">
                                    <button type="button" className="btn btn-primary comp-hwcr-species-btn">{species}</button>
                                </td>
                                <td className="comp-hwcr-area-cell comp-hwcr-cell">{geo_organization_unit_code}</td>
                                <td className="comp-hwcr-location-cell comp-hwcr-cell">{location_summary}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell">
                                    Unassigned
                                </td>
                                <td className="comp-hwcr-status-cell comp-hwcr-cell">
                                <button type="button" className={statusClass}>{status}</button>
                                </td>
                                <td className="comp-hwcr-last-updated-cell comp-hwcr-cell">{update_date}</td>
                            </Row>
                        )
                    }
                    })}
            </tbody>
        </Table>
    );
  };