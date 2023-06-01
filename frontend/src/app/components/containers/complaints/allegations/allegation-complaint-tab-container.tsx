import { FC } from "react";
import "../../../../../assets/sass/app.scss";
import { AllegationComplaintTableHeader } from "./allegation-complaint-table-header";
import { AllegationComplaintTable } from "./allegation-complaint-table";

export const AllegationComplaintTabContainer: FC = () => {
    return <><div className="allegation-div-tab"><ul className="nav nav-tabs comp-allegation-tab">
        <li className="nav-item comp-allegation-tab-active">
            <a className="nav-link active" aria-current="page" href="#">Human Wildlife Conflicts</a>
        </li>
        <li className="nav-item comp-allegation-tab-inactive">
            <a className="nav-link" href="#">Enforcement</a>
        </li>
        </ul>
    </div>
    <AllegationComplaintTableHeader/>
    <AllegationComplaintTable /></>
    ;
}