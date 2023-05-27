import { FC, useEffect, useState } from "react";
import "./hwcr-complaint.scss";
import { format } from 'date-fns';
import axios from 'axios';
import config from '../../../../config';

//const response = await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint`);
//(await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint`)).data;
/*[
    {
        "complaint_identifier": {
            "detail_text": "today's QAT or UAT test",
            "caller_name": "Chris",
            "caller_address": "1264 Disco Rd.",
            "caller_email": "test@test.ca",
            "caller_phone_1": "(250)-555-3425",
            "caller_phone_2": "(250)-555-3425",
            "caller_phone_3": "(250)-555-3425",
            "location_geometry_point": {
                "type": "Point",
                "coordinates": [
                    -48.23456,
                    20.12345
                ]
            },
            "location_summary_text": "summary",
            "location_detailed_text": "detail_text",
            "incident_datetime": "2023-02-22T00:00:00.000Z",
            "incident_reported_datetime": "2023-02-22T00:00:00.000Z",
            "referred_by_agency_other_text": "other text",
            "create_user_id": "chris",
            "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
            "create_timestamp": "2023-02-22T00:00:00.000Z",
            "update_user_id": "chis",
            "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
            "update_timestamp": "2023-02-22T00:00:00.000Z",
            "complaint_identifier": "COS-0001",
            "referred_by_agency_code": {
                "agency_code": "COS",
                "short_description": "COS",
                "long_description": "Conservation Officer Service",
                "display_order": 3,
                "active_ind": true,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            },
            "owned_by_agency_code": {
                "agency_code": "COS",
                "short_description": "COS",
                "long_description": "Conservation Officer Service",
                "display_order": 3,
                "active_ind": true,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            },
            "complaint_status_code": {
                "complaint_status_code": "OPEN",
                "short_description": "OPEN",
                "long_description": "Open",
                "display_order": 1,
                "active_ind": true,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            },
            "geo_organization_unit_code": {
                "geo_organization_unit_code": "CRBOCHLCTN",
                "short_description": "Cariboo Chilcotin",
                "long_description": "Cariboo Chilcotin",
                "effective_date": "2023-05-16T20:34:21.601Z",
                "expiry_date": null,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            }
        },
        "species_code": {
            "species_code": "BLKBEAR",
            "short_description": "Black Bear",
            "long_description": "Black Bear",
            "display_order": 2,
            "active_ind": true,
            "legacy_code": null,
            "create_user_id": "nr-compliance-enforcement",
            "create_user_guid": null,
            "create_timestamp": "2023-05-16T20:34:21.601Z",
            "update_user_id": "nr-compliance-enforcement",
            "update_user_guid": null,
            "update_timestamp": "2023-05-16T20:34:21.601Z"
        },
        "hwcr_complaint_nature_code": {
            "hwcr_complaint_nature_code": "AGGPRES",
            "short_description": "AGGPRES",
            "long_description": "Aggressive - present/recent",
            "display_order": 2,
            "active_ind": true,
            "create_user_id": "nr-compliance-enforcement",
            "create_user_guid": null,
            "create_timestamp": "2023-05-16T20:34:21.601Z",
            "update_user_id": "nr-compliance-enforcement",
            "update_user_guid": null,
            "update_timestamp": "2023-05-16T20:34:21.601Z"
        },
        "attractant_hwcr_xref": [
            {
                "attractant_hwcr_xref_guid": "fbb4c64b-6ff9-4761-901a-cff80f7c0a8b",
                "create_user_id": "chris",
                "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
                "create_timestamp": "2023-02-22T00:00:00.000Z",
                "update_user_id": "chis",
                "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
                "update_timestamp": "2023-02-22T00:00:00.000Z",
                "attractant_code": {
                    "attractant_code": "COMPOST",
                    "short_description": "Compost",
                    "long_description": "Compost",
                    "display_order": 5,
                    "active_ind": true,
                    "create_user_id": "nr-compliance-enforcement",
                    "create_user_guid": null,
                    "create_timestamp": "2023-05-16T20:34:21.601Z",
                    "update_user_id": "nr-compliance-enforcement",
                    "update_user_guid": null,
                    "update_timestamp": "2023-05-16T20:34:21.601Z"
                }
            },
            {
                "attractant_hwcr_xref_guid": "0f75501f-8b5f-41d4-a37e-ebcefee39160",
                "create_user_id": "chris",
                "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
                "create_timestamp": "2023-02-22T00:00:00.000Z",
                "update_user_id": "chis",
                "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
                "update_timestamp": "2023-02-22T00:00:00.000Z",
                "attractant_code": {
                    "attractant_code": "GARBAGE",
                    "short_description": "Garbage",
                    "long_description": "Garbage",
                    "display_order": 8,
                    "active_ind": true,
                    "create_user_id": "nr-compliance-enforcement",
                    "create_user_guid": null,
                    "create_timestamp": "2023-05-16T20:34:21.601Z",
                    "update_user_id": "nr-compliance-enforcement",
                    "update_user_guid": null,
                    "update_timestamp": "2023-05-16T20:34:21.601Z"
                }
            }
        ],
        "other_attractants_text": "other attractants text",
        "create_user_id": "chris",
        "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
        "create_timestamp": "2023-02-22T00:00:00.000Z",
        "update_user_id": "chis",
        "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
        "update_timestamp": "2023-02-22T00:00:00.000Z",
        "hwcr_complaint_guid": "6f85cb16-faf7-40bd-850b-be11c34989d3"
    },
    {
        "complaint_identifier": {
            "detail_text": "Second complaint",
            "caller_name": "Chris",
            "caller_address": "1264 Disco Rd.",
            "caller_email": "test@test.ca",
            "caller_phone_1": "(250)-555-3425",
            "caller_phone_2": "(250)-555-3425",
            "caller_phone_3": "(250)-555-3425",
            "location_geometry_point": {
                "type": "Point",
                "coordinates": [
                    -48.23456,
                    20.12345
                ]
            },
            "location_summary_text": "summary",
            "location_detailed_text": "detail_text",
            "incident_datetime": "2023-02-22T00:00:00.000Z",
            "incident_reported_datetime": "2023-02-22T00:00:00.000Z",
            "referred_by_agency_other_text": "other text",
            "create_user_id": "chris",
            "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
            "create_timestamp": "2023-02-22T00:00:00.000Z",
            "update_user_id": "chis",
            "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
            "update_timestamp": "2023-02-22T00:00:00.000Z",
            "complaint_identifier": "COS-0002",
            "referred_by_agency_code": {
                "agency_code": "COS",
                "short_description": "COS",
                "long_description": "Conservation Officer Service",
                "display_order": 3,
                "active_ind": true,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            },
            "owned_by_agency_code": {
                "agency_code": "COS",
                "short_description": "COS",
                "long_description": "Conservation Officer Service",
                "display_order": 3,
                "active_ind": true,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            },
            "complaint_status_code": {
                "complaint_status_code": "CLOSED",
                "short_description": "CLOSED",
                "long_description": "Closed",
                "display_order": 1,
                "active_ind": true,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            },
            "geo_organization_unit_code": {
                "geo_organization_unit_code": "CRBOCHLCTN",
                "short_description": "Cariboo Chilcotin",
                "long_description": "Cariboo Chilcotin",
                "effective_date": "2023-05-16T20:34:21.601Z",
                "expiry_date": null,
                "create_user_id": "nr-compliance-enforcement",
                "create_user_guid": null,
                "create_timestamp": "2023-05-16T20:34:21.601Z",
                "update_user_id": "nr-compliance-enforcement",
                "update_user_guid": null,
                "update_timestamp": "2023-05-16T20:34:21.601Z"
            }
        },
        "species_code": {
            "species_code": "BLKBEAR",
            "short_description": "Black Bear",
            "long_description": "Black Bear",
            "display_order": 2,
            "active_ind": true,
            "legacy_code": null,
            "create_user_id": "nr-compliance-enforcement",
            "create_user_guid": null,
            "create_timestamp": "2023-05-16T20:34:21.601Z",
            "update_user_id": "nr-compliance-enforcement",
            "update_user_guid": null,
            "update_timestamp": "2023-05-16T20:34:21.601Z"
        },
        "hwcr_complaint_nature_code": {
            "hwcr_complaint_nature_code": "AGGPRES",
            "short_description": "AGGPRES",
            "long_description": "Aggressive - present/recent",
            "display_order": 2,
            "active_ind": true,
            "create_user_id": "nr-compliance-enforcement",
            "create_user_guid": null,
            "create_timestamp": "2023-05-16T20:34:21.601Z",
            "update_user_id": "nr-compliance-enforcement",
            "update_user_guid": null,
            "update_timestamp": "2023-05-16T20:34:21.601Z"
        },
        "attractant_hwcr_xref": [
            {
                "attractant_hwcr_xref_guid": "0e1336a4-0f09-48fd-ac99-d96bdfc95335",
                "create_user_id": "chris",
                "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
                "create_timestamp": "2023-02-22T00:00:00.000Z",
                "update_user_id": "chis",
                "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
                "update_timestamp": "2023-02-22T00:00:00.000Z",
                "attractant_code": {
                    "attractant_code": "COMPOST",
                    "short_description": "Compost",
                    "long_description": "Compost",
                    "display_order": 5,
                    "active_ind": true,
                    "create_user_id": "nr-compliance-enforcement",
                    "create_user_guid": null,
                    "create_timestamp": "2023-05-16T20:34:21.601Z",
                    "update_user_id": "nr-compliance-enforcement",
                    "update_user_guid": null,
                    "update_timestamp": "2023-05-16T20:34:21.601Z"
                }
            }
        ],
        "other_attractants_text": "other attractants text",
        "create_user_id": "chris",
        "create_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
        "create_timestamp": "2023-02-22T00:00:00.000Z",
        "update_user_id": "chis",
        "update_user_guid": "903f87c8-76dd-427c-a1bb-4d179e443252",
        "update_timestamp": "2023-02-22T00:00:00.000Z",
        "hwcr_complaint_guid": "168dddb7-d5eb-4ffe-af0b-bf29f03ae5dc"
    }
]*/


interface HwcrComplaint {
    complaint_identifier: {complaint_identifier: string, geo_organization_unit_code:{short_description: string}, incident_datetime: string, location_summary_text:string, update_user_id:string, update_timestamp:string, complaint_status_code:{long_description:string}};
    hwcr_complaint_nature_code: {long_description:string}
    species_code: {short_description:string}
  }

//TODO: fetch data smarter

export const HwcrComplaintTable: FC = () => {
    const [data, setData] = useState<HwcrComplaint[]>([]);
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
    }, []);
    

    return (
        <table className="comp-hwcr-table">
            <tbody>
                {data.map((val, key, {length}) => {
                    //alternate behaviour for last row for alternate borders and radius'
                    if(length - 1 === key)
                    {
                        return (
                            <tr key={key}>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-bottom-left">{val.complaint_identifier.complaint_identifier}</td>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell-bottom comp-hwcr-cell">
                                    {
                                        format(Date.parse(val.complaint_identifier.incident_datetime), 'yyyy/MM/dd kk:mm:ss')
                                    }
                                </td>
                                <td className="comp-hwcr-nature-complaint-cell comp-hwcr-cell comp-hwcr-cell-bottom">{val.hwcr_complaint_nature_code.long_description}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <button type="button" className="btn btn-primary comp-hwcr-species-btn">{val.species_code.short_description}</button>
                                </td>
                                <td className="comp-hwcr-area-cell comp-hwcr-cell comp-hwcr-cell-bottom">{val.complaint_identifier.geo_organization_unit_code.short_description}</td>
                                <td className="comp-hwcr-location-cell comp-hwcr-cell comp-hwcr-cell-bottom">{val.complaint_identifier.location_summary_text}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <div className="comp-hwcr-circle">CN</div>
                                    <div className="comp-hwcr-assigned">
                                        {val.complaint_identifier.update_user_id}
                                    </div>
                                </td>
                                <td className="comp-hwcr-status-cell comp-hwcr-cell comp-hwcr-cell-bottom">
                                    <button type="button" className="btn btn-primary comp-hwcr-status-btn">{val.complaint_identifier.complaint_status_code.long_description}</button>
                                </td>
                                <td className="comp-hwcr-last-updated-cell comp-hwcr-cell comp-hwcr-cell-bottom comp-bottom-right">
                                    {
                                        format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss')
                                    }
                                </td>
                            </tr>
                        )
                    }
                    else
                    {
                        return (
                            <tr key={key}>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell">{val.complaint_identifier.complaint_identifier}</td>
                                <td className="comp-hwcr-small-cell comp-hwcr-cell">
                                    {
                                        format(Date.parse(val.complaint_identifier.incident_datetime), 'yyyy/MM/dd kk:mm:ss')
                                    }
                                </td>
                                <td className="comp-hwcr-nature-complaint-cell comp-hwcr-cell">{val.hwcr_complaint_nature_code.long_description}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell">
                                    <button type="button" className="btn btn-primary comp-hwcr-species-btn">{val.species_code.short_description}</button>
                                </td>
                                <td className="comp-hwcr-area-cell comp-hwcr-cell">{val.complaint_identifier.geo_organization_unit_code.short_description}</td>
                                <td className="comp-hwcr-location-cell comp-hwcr-cell">{val.complaint_identifier.location_summary_text}</td>
                                <td className="comp-hwcr-medium-cell comp-hwcr-cell">
                                    <div className="comp-hwcr-circle">CN</div>
                                    <div className="comp-hwcr-assigned">
                                        {val.complaint_identifier.update_user_id}
                                    </div>
                                </td>
                                <td className="comp-hwcr-status-cell comp-hwcr-cell">
                                    <button type="button" className="btn btn-primary comp-hwcr-status-btn">{val.complaint_identifier.complaint_status_code.long_description}</button>
                                </td>
                                <td className="comp-hwcr-last-updated-cell comp-hwcr-cell">
                                    {
                                        format(Date.parse(val.complaint_identifier.update_timestamp), 'yyyy/MM/dd kk:mm:ss')
                                    }
                                </td>
                            </tr>
                        )
                    }
                    })}
            </tbody>
        </table>
    );
  };