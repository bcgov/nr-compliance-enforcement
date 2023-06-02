import { FC } from "react";
import "../../../../../assets/sass/app.scss";
import { AllegationComplaintTableHeader } from "./allegation-complaint-table-header";
import { AllegationComplaintTable } from "./allegation-complaint-table";

type Props = {
    handleChange: Function;
}

export const AllegationComplaintTabContainer: FC<Props>  = ({ handleChange }) => {
    return <><div className="allegation-div-tab"><ul className="nav nav-tabs comp-allegation-tab">
        <li className="nav-item comp-allegation-tab-inactive">
            <a className="nav-link" aria-current="page" href="#" onClick={() => handleChange(0)} >Human Wildlife Conflicts</a>
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