import { FC, useState } from "react";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";
import ComplaintType from "../../../constants/complaint-types";

type Props = {
    initialState: number;
}

export const ComplaintContainer: FC<Props>  = ({ initialState }) => {
    const [complaintType, setComplaintType] = useState(initialState);
    const [sortColumn, setSortColumn] = useState("incident_reported_datetime");
    const [sortOrder, setSortOrder] = useState("DESC");
    function handleChange(newState: number)
    {
        setComplaintType(newState);
    }
    function handleSort(newSortColumn: string)
    {
        if(newSortColumn === sortColumn)
        {
            if(sortOrder === "DESC")
            {
                setSortOrder("ASC");
            }
            else
            {
                setSortOrder("DESC");
            }
        }
        else
        {
            setSortColumn(newSortColumn);
            setSortOrder("DESC");
        }
    }
    if(complaintType === ComplaintType.HWCR_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><HwcrComplaintTabContainer handleSort={handleSort} handleChange={handleChange} sortColumn={sortColumn} sortOrder={sortOrder}/></div>
        </>;
    }
    else if(complaintType === ComplaintType.ALLEGATION_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><AllegationComplaintTabContainer handleSort={handleSort} handleChange={handleChange} sortColumn={sortColumn} sortOrder={sortOrder}/></div>
        </>;
    }
    else
    {
        return <></>;
    }
}