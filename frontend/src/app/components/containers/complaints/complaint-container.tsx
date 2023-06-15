import { FC, useState } from "react";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";
import ComplaintType from "../../../constants/complaint-types";
import { HwcrComplaintFilterContainer } from "./hwcr/hwcr-complaint-filter-container";

type Props = {
    initialState: number;
}

export const ComplaintContainer: FC<Props>  = ({ initialState }) => {
    const [complaintType, setComplaintType] = useState(initialState);
    const [sort, setSort] = useState(["incident_reported_datetime", "DESC"]);
    const [natureOfComplaintFilter, setNatureOfComplaintFilter] = useState("");
    const [speicesCodeFilter, setSpeicesCodeFilter] = useState("");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    function handleChange(newState: number)
    {
        setComplaintType(newState);
        setSort(["incident_reported_datetime", "DESC"]);
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
            if(newSortColumn === "incident_reported_datetime" || newSortColumn === "update_timestamp")
            {
                setSort([newSortColumn, "DESC"]);
            }
            else
            {
                setSort([newSortColumn, "ASC"]);
            }
        }
    }
    function handleNatureOfComplaintFilter(newNatureOfComplaintFilter: string)
    {
        setNatureOfComplaintFilter(newNatureOfComplaintFilter);
    }
    function handleSpeciesCodeFilter(newSpeciesFilter: string)
    {
        setSpeicesCodeFilter(newSpeciesFilter);
    }
    function handleStartDateFilter(newStartDateFilter: string)
    {
        setStartDateFilter(newStartDateFilter);
    }
    function handleEndDateFilter(newEndDateFilter: string)
    {
        setEndDateFilter(newEndDateFilter);
    }
    function handleStatusFilter(newStatusFilter: string)
    {
        setStatusFilter(newStatusFilter);
    }
    if(complaintType === ComplaintType.HWCR_COMPLAINT)
    {
        return <>
            <div className="comp-sub-header">Complaints</div>
            <div><HwcrComplaintFilterContainer handleNatureOfComplaintFilter={handleNatureOfComplaintFilter} handleSpeciesCodeFilter={handleSpeciesCodeFilter} handleStartDateFilter={handleStartDateFilter} handleEndDateFilter={handleEndDateFilter} handleStatusFilter={handleStatusFilter} /></div>
            <div><HwcrComplaintTabContainer handleSort={handleSort} handleChange={handleChange} sort={sort} natureOfComplaintFilter={natureOfComplaintFilter} speciesCodeFilter={speicesCodeFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} statusFilter={statusFilter}/></div>
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