import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";

type Props = {
    handleChange: Function,
    handleSort: Function,
    sort: string[],
}

export const HwcrComplaintTabContainer: FC<Props>  = ({ handleChange, handleSort, sort }) => {
    return <><div className="comp-div-tab"><ul className="nav nav-tabs comp-tab">
        <li className="nav-item comp-tab-active">
            <a className="nav-link active">Human Wildlife Conflicts</a>
        </li>
        <li className="nav-item comp-tab-inactive">
            <a className="nav-link" href="#" onClick={() => handleChange(ComplaintType.ALLEGATION_COMPLAINT)}>Enforcement</a>
        </li>
        </ul>
    </div>
    <HwcrComplaintTableHeader handleSort={handleSort}/>
    <HwcrComplaintTable sortColumn={sort[0]} sortOrder={sort[1]} /></>
    ;
}