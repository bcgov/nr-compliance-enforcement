import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";
import ComplaintType from "../../../../constants/complaint-types";

type Props = {
    handleChange: Function;
}

export const HwcrComplaintTabContainer: FC<Props>  = ({ handleChange }) => {
    return <><div className="hwcr-div-tab"><ul className="nav nav-tabs comp-hwcr-tab">
        <li className="nav-item comp-hwcr-tab-active">
            <a className="nav-link active">Human Wildlife Conflicts</a>
        </li>
        <li className="nav-item comp-hwcr-tab-inactive">
            <a className="nav-link" href="#" onClick={() => handleChange(ComplaintType.ALLEGATION_COMPLAINT)}>Enforcement</a>
        </li>
        </ul>
    </div>
    <HwcrComplaintTableHeader/>
    <HwcrComplaintTable /></>
    ;
}