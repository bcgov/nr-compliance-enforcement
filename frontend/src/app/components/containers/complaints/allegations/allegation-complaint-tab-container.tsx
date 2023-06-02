import { FC } from "react";
import { AllegationComplaintTableHeader } from "./allegation-complaint-table-header";
import { AllegationComplaintTable } from "./allegation-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";

type Props = {
    handleChange: Function;
}

export const AllegationComplaintTabContainer: FC<Props>  = ({ handleChange }) => {
    return <><div className="allegation-div-tab"><ul className="nav nav-tabs comp-allegation-tab">
        <li className="nav-item comp-allegation-tab-inactive">
            <a className="nav-link" href="#" onClick={() => handleChange(ComplaintType.HWCR_COMPLAINT)} >Human Wildlife Conflicts</a>
        </li>
        <li className="nav-item comp-allegation-tab-active">
            <a className="nav-link active">Enforcement</a>
        </li>
        </ul>
    </div>
    <AllegationComplaintTableHeader/>
    <AllegationComplaintTable /></>
    ;
}