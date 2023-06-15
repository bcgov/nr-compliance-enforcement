import { FC, useEffect, useState } from "react";
import axios from "axios";
import config from "../../../../../config";
import { HwcrNatureOfComplaintCode } from "../../../../types/code-tables/hwcr-nature-of-complaint-codes";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";

export const HwcrComplaintFilterContainer: FC  = () => {
    const [hwcrNatureOfComplaintCodes, setHwcrNatureOfComplaintCodes] = useState<JsonObject>({});
    useEffect(() => {
        async function fetchHwcrNatureOfComplaintCodes()
        {
            const token = localStorage.getItem("user");
            if (token) {
                console.log("testing2");

                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                    await axios.get(`${config.API_BASE_URL}/v1/hwcr-complaint`).then((response) => {
                        console.log("testing: " + response.data);
                        setHwcrNatureOfComplaintCodes(response.data);
                    });
            }
        }
        fetchHwcrNatureOfComplaintCodes();
      }, []);
    return( 
    <>
        <div>
            <select>
                <option value=""></option>
                {
                    hwcrNatureOfComplaintCodes.map((val, key, {length}) => {
                        return <option value={val.nature_of_complaint_code}>{val.long_description}</option>
                    })
                }
            </select>
        </div>
    </>)
}