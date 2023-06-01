import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";

export const HwcrComplaintTabContainer: FC = () => {
    return <><div className="hwcr-div-tab"><ul className="nav nav-tabs comp-hwcr-tab">
        <li className="nav-item comp-hwcr-tab-active">
            <a className="nav-link active" aria-current="page" href="#">Human Wildlife Conflicts</a>
        </li>
        <li className="nav-item comp-hwcr-tab-inactive">
            <a className="nav-link" href="#">Enforcement</a>
        </li>
        </ul>
    </div>
    <HwcrComplaintTableHeader/>
    <HwcrComplaintTable /></>
    ;
}