import { FC, useEffect, useState } from "react";
import axios from "axios";
import config from "../../../../../config";
import { HwcrNatureOfComplaintCode } from "../../../../types/code-tables/hwcr-nature-of-complaint-code";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import Form from "react-bootstrap/Form";
import { SpeciesCode } from "../../../../types/code-tables/species-code";
import { ComplaintStatusCode } from "../../../../types/code-tables/complaint-status-code";

type Props = {
    handleNatureOfComplaintFilter: Function,
    handleSpeciesCodeFilter: Function,
    handleStartDateFilter: Function,
    handleEndDateFilter: Function,
    handleStatusFilter: Function,
}

export const HwcrComplaintFilterContainer: FC<Props>  = ({handleNatureOfComplaintFilter, handleSpeciesCodeFilter, handleStartDateFilter, handleEndDateFilter, handleStatusFilter}) => {
    const [hwcrNatureOfComplaintCodes, setHwcrNatureOfComplaintCodes] = useState<HwcrNatureOfComplaintCode[]>([] as Array<HwcrNatureOfComplaintCode>);
    const [speciesCodes, setSpeciesCodes] = useState<SpeciesCode[]>([] as Array<SpeciesCode>);
    const [complaintStatusCodes, setComplaintStatusCodes] = useState<ComplaintStatusCode[]>([] as Array<ComplaintStatusCode>);
    useEffect(() => {
        async function fetchCodes()
        {
            const token = localStorage.getItem("user");
            if (token) {
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint-nature-code`).then((response) => {
                        setHwcrNatureOfComplaintCodes(response.data);
                    });
                    await axios.get(`${config.API_BASE_URL}/v1/species-code`).then((response) => {
                        setSpeciesCodes(response.data);
                    });
                    await axios.get(`${config.API_BASE_URL}/v1/complaint-status-code`).then((response) => {
                        setComplaintStatusCodes(response.data);
                    });
            }
        }
        fetchCodes();
      }, []);
    return( 
    <>
        <div>
            Nature of Complaint:   
        </div>
        <div>
            <select onChange={e => handleNatureOfComplaintFilter(e.target.value)} placeholder="Select">
                <option value=""></option>
                {
                    hwcrNatureOfComplaintCodes.map((val, key, {length}) => {
                        return <option key={val.hwcr_complaint_nature_code} value={val.hwcr_complaint_nature_code}>{val.long_description}</option>
                    })
                }
            </select>
        </div>
        <div>
            Species:  
        </div>
        <div> 
            <select onChange={e => handleSpeciesCodeFilter(e.target.value)} placeholder="Select">
                <option></option>
                {
                    speciesCodes.map((val, key, {length}) => {
                        return <option key={val.species_code} value={val.species_code}>{val.long_description}</option>
                    })
                }
            </select>
        </div>
        <div>
            Date Logged
        </div>
        <div>
            <Form.Control type="date" placeholder="Start date" data-date-format="YYYY-MM-DD" onChange={e => handleStartDateFilter(e.target.value)}></Form.Control>
        </div>
        <div>
            <Form.Control type="date" placeholder="End date" data-date-format="YYYY-MM-DD" onChange={e => handleEndDateFilter(e.target.value)}></Form.Control>
        </div>
        <div>
            Status:  
        </div>
        <div> 
            <select onChange={e => handleStatusFilter(e.target.value)} placeholder="Select">
                <option value=""></option>
                {
                    complaintStatusCodes.map((val, key, {length}) => {
                        return <option key={val.complaint_status_code} value={val.complaint_status_code}>{val.long_description}</option>
                    })
                }
            </select>
        </div>
    </>)
}