import { FC } from "react";
import { AllegationComplaintTableHeader } from "./allegation-complaint-table-header";
import { AllegationComplaintTable } from "./allegation-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";

type Props = {
    handleChange: Function,
    handleSort: Function,
    sort: string[],
}

export const AllegationComplaintTabContainer: FC<Props>  = ({ handleChange, handleSort, sort }) => {
    return <><div className="comp-div-tab"><ul className="nav nav-tabs comp-tab">
        <li className="nav-item comp-tab-inactive">
            <button className="nav-link" onClick={() => handleChange(ComplaintType.HWCR_COMPLAINT)} >Human Wildlife Conflicts</button>
        </li>
        <li className="nav-item comp-tab-active">
            <button className="nav-link active">Enforcement</button>
        </li>
        </ul>
    </div>
    <AllegationComplaintTableHeader handleSort={handleSort}/>
    <AllegationComplaintTable sortColumn={sort[0]} sortOrder={sort[1]}/></>
    ;
}