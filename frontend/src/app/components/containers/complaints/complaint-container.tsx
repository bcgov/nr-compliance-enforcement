import { FC, useState } from "react";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";

type Props = {
    initialState: number;
}

const HWCR_COMPLAINT = 0;
const ALLEGATION_COMPLAINT = 1;


export const ComplaintContainer: FC<Props>  = ({ initialState }) => {
    const [value, setValue] = useState(initialState);

    function useHandleChange(newState: number)
    { // integer state
        setValue(newState);
    }
    if(value === HWCR_COMPLAINT)
    {
        return <>
            <div className="comp-allegation-header">Complaints</div>
            <div><HwcrComplaintTabContainer handleChange={useHandleChange}/></div>
        </>;
    }
    else if(value === ALLEGATION_COMPLAINT)
    {
        return <>
            <div className="comp-allegation-header">Complaints</div>
            <div><AllegationComplaintTabContainer handleChange={useHandleChange}/></div>
        </>;
    }
    else
    {
        return <></>;
    }
}