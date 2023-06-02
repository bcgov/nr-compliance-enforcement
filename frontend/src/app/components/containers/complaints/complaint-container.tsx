import { FC, useState } from "react";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";
import ComplaintType from "../../../constants/complaint-types";

type Props = {
    initialState: number;
}

export const ComplaintContainer: FC<Props>  = ({ initialState }) => {
    const [value, setValue] = useState(initialState);
    function handleChange(newState: number)
    {
        setValue(newState);
    }
    if(value === ComplaintType.HWCR_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><HwcrComplaintTabContainer handleChange={handleChange}/></div>
        </>;
    }
    else if(value === ComplaintType.ALLEGATION_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><AllegationComplaintTabContainer handleChange={handleChange}/></div>
        </>;
    }
    else
    {
        return <></>;
    }
}