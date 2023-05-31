import { FC, useEffect, useState } from "react";
import "../../../../assets/sass/app.scss";
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
        <Table className="comp-hwcr-table">
            <tbody>
                {hwcrComplaintsArray.map((val, key, {length}) => {
                    //alternate behaviour for last row for alternate borders and radius'
                    if(length - 1 === key)
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-hwcr-cell-left comp-bottom-left">{val.complaint_identifier.complaint_identifier}</td>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell-bottom comp-hwcr-cell">
                                    {
                                        val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : ""
                                    }
                                </td>
                                <td className="comp-hwcr-nature-complaint-cell comp-hwcr-cell comp-hwcr-cell-bottom">{val.hwcr_complaint_nature_code != null ? val.hwcr_complaint_nature_code.long_description : ""}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <button type="button" className="btn btn-primary comp-hwcr-species-btn">{val.species_code.short_description}</button>
                                </td>
                                <td className="comp-hwcr-area-cell comp-hwcr-cell comp-hwcr-cell-bottom">{val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : ""}</td>
                                <td className="comp-hwcr-location-cell comp-hwcr-cell comp-hwcr-cell-bottom">{val.complaint_identifier.location_summary_text}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <div className="comp-hwcr-circle">CN</div>
                                    <div className="comp-hwcr-assigned">
                                        {val.complaint_identifier.update_user_id}
                                    </div>
                                </td>
                                <td className="comp-hwcr-status-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <button type="button" className={ val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-hwcr-status-closed-btn' : 'btn btn-primary comp-hwcr-status-open-btn' }>{val.complaint_identifier.complaint_status_code.long_description}</button>
                                </td>
                                <td className="comp-hwcr-last-updated-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-bottom-right">
                                    {
                                        val.complaint_identifier.update_timestamp != null ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : ""
                                    }
                                </td>
                            </Row>
                        )
                    }
                    else
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell comp-hwcr-cell-left">{val.complaint_identifier.complaint_identifier}</td>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell">
                                    {
                                        val.complaint_identifier.incident_reported_datetime != null ? format(Date.parse(val.complaint_identifier.incident_reported_datetime), 'yyyy/MM/dd kk:mm:ss') : ""
                                    }
                                </td>
                                <td className="comp-hwcr-nature-complaint-cell comp-hwcr-cell">{val.hwcr_complaint_nature_code != null ? val.hwcr_complaint_nature_code.long_description : ""}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell">
                                    <button type="button" className="btn btn-primary comp-hwcr-species-btn">{val.species_code.short_description}</button>
                                </td>
                                <td className="comp-hwcr-area-cell comp-hwcr-cell">{val.complaint_identifier.geo_organization_unit_code ? val.complaint_identifier.geo_organization_unit_code.short_description : ""}</td>
                                <td className="comp-hwcr-location-cell comp-hwcr-cell">{val.complaint_identifier.location_summary_text}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell">
                                    <div className="comp-hwcr-circle">CN</div>
                                    <div className="comp-hwcr-assigned">
                                        {val.complaint_identifier.update_user_id}
                                    </div>
                                </td>
                                <td className="comp-hwcr-status-cell comp-hwcr-cell">
                                <button type="button" className={ val.complaint_identifier.complaint_status_code.long_description === 'Closed' ? 'btn btn-primary comp-hwcr-status-closed-btn' : 'btn btn-primary comp-hwcr-status-open-btn' }>{val.complaint_identifier.complaint_status_code.long_description}</button>
                                </td>
                                <td className="comp-hwcr-last-updated-cell comp-hwcr-cell">
                                    {
                                        val.complaint_identifier.update_timestamp != null ? format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss') : ""
                                    }
                                </td>
                            </Row>
                        )
                    }
                    })}
            </tbody>
        </Table>
    );
  };