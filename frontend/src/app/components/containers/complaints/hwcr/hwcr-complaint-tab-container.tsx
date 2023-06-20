import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";

type Props = {
    handleChange: Function,
    handleSort: Function,
    sort: string[],
    natureOfComplaintFilter: Option | null,
    speciesCodeFilter: Option | null,
    startDateFilter: Date | undefined,
    endDateFilter: Date | undefined,
    complaintStatusFilter: Option | null,
}

export const HwcrComplaintTabContainer: FC<Props>  = ({ handleChange, handleSort, sort, natureOfComplaintFilter, speciesCodeFilter, startDateFilter, endDateFilter, complaintStatusFilter }) => {
    return <><div className="comp-div-tab"><ul className="nav nav-tabs comp-tab">
        <li className="nav-item comp-tab-active">
            <button className="nav-link active">Human Wildlife Conflicts</button>
        </li>
        <li className="nav-item comp-tab-inactive">
            <button className="nav-link" onClick={() => handleChange(ComplaintType.ALLEGATION_COMPLAINT)}>Enforcement</button>
        </li>
        </ul>
    </div>
    <HwcrComplaintTableHeader handleSort={handleSort}/>
    <HwcrComplaintTable sortColumn={sort[0]} sortOrder={sort[1]} natureOfComplaintFilter={natureOfComplaintFilter} speciesCodeFilter={speciesCodeFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} complaintStatusFilter={complaintStatusFilter} /></>
    ;
}