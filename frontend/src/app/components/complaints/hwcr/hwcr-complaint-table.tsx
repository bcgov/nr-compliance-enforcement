import { FC, useEffect, useState } from "react";
import "../../../../assets/sass/app.scss";
import { format } from 'date-fns';
import axios from 'axios';
import config from '../../../../config';
import { Row, Table } from "react-bootstrap";
import { useAppDispatch, useAppSelector, useHwcrSelector } from "../../../hooks/hooks";
import { getHwcrComplaints, hwcrComplaintsArray } from "../../../store/reducers/hwcr-complaints"

interface HwcrComplaint {
    complaint_identifier: {complaint_identifier: string, geo_organization_unit_code:{short_description: string}, incident_datetime: string, incident_reported_datetime: string, location_summary_text:string, update_user_id:string, update_timestamp:string, complaint_status_code:{long_description:string}};
    hwcr_complaint_nature_code: {long_description:string}
    species_code: {short_description:string}
  }

//TODO: fetch data smarter

export const HwcrComplaintTable: FC = () => {
    
    const dispatch = useAppDispatch();

    const [hwcrComplaints, setData] = useState<HwcrComplaint[]>([]);
    useEffect(() => {
        const fetchData = async () => {
        try {
            
            let token = localStorage.getItem("user");
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                
            const response = await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint`);
            setData(response.data);
        } catch (error) {
            console.error(error);
        }
        };
        fetchData().catch(e => {
            console.error(e);
          });
    }, [hwcrComplaints, dispatch]);
/*
    const dispatch = useAppDispatch();

    const hwcrComplaints = useHwcrSelector(hwcrComplaintsArray);

    useEffect(() => {
        if (!hwcrComplaints) {
        dispatch(getHwcrComplaints());
    }
  }, [hwcrComplaints, dispatch]); 

  console.error(hwcrComplaints);*/

    return (
        <Table className="comp-hwcr-table">
            <tbody>
                {hwcrComplaints.map((val, key, {length}) => {
                    //alternate behaviour for last row for alternate borders and radius'
                    var statusClass = "";
                    if(length - 1 === key)
                    {
                        return (
                            <Row key={key}>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-bottom-left">{val.complaint_identifier.complaint_identifier}</td>
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
                                <td className="comp-hwcr-small-cell comp-hwcr-cell">{val.complaint_identifier.complaint_identifier}</td>
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