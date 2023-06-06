import { FC, useState } from "react";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";
import ComplaintType from "../../../constants/complaint-types";

type Props = {
    initialState: number;
}

export const ComplaintContainer: FC<Props>  = ({ initialState }) => {
    const [complaintType, setComplaintType] = useState(initialState);
    const [sort, setSort] = useState(["incident_reported_datetime", "DESC"]);
    function handleChange(newState: number)
    {
        setComplaintType(newState);
    }
    function handleSort(newSortColumn: string)
    {
        if(newSortColumn === sort[0])
        {
            if(sort[1] === "DESC")
            {
                setSort([newSortColumn, "ASC"]);
            }
            else
            {
                setSort([newSortColumn, "DESC"]);
            }
        }
        else
        {
            //setSortColumn(newSortColumn);
            setSort([newSortColumn, "DESC"]);
        }
    }
    if(complaintType === ComplaintType.HWCR_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><HwcrComplaintTabContainer handleSort={handleSort} handleChange={handleChange} sort={sort}/></div>
        </>;
    }
    else if(complaintType === ComplaintType.ALLEGATION_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><AllegationComplaintTabContainer handleSort={handleSort} handleChange={handleChange} sort={sort}/></div>
        </>;
    }
    else
    {
        return <></>;
    }
}