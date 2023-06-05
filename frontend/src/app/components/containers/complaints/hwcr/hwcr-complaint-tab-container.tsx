import { FC } from "react";
import { HwcrComplaintTableHeader } from "./hwcr-complaint-table-header";
import { HwcrComplaintTable } from "./hwcr-complaint-table";

<<<<<<< Updated upstream
export const HwcrComplaintTabContainer: FC = () => {
    return <><div className="hwcr-div-tab"><ul className="nav nav-tabs comp-hwcr-tab">
        <li className="nav-item comp-hwcr-tab-active">
            <a className="nav-link active" aria-current="page" href="#">Human Wildlife Conflicts</a>
=======
type Props = {
    handleChange: Function,
    handleSort: Function,
    sortColumn: string,
    sortOrder: string,
}

export const HwcrComplaintTabContainer: FC<Props>  = ({ handleChange, handleSort, sortColumn, sortOrder }) => {
    return <><div className="comp-div-tab"><ul className="nav nav-tabs comp-tab">
        <li className="nav-item comp-tab-active">
            <a className="nav-link active">Human Wildlife Conflicts</a>
>>>>>>> Stashed changes
        </li>
        <li className="nav-item comp-hwcr-tab-inactive">
            <a className="nav-link" href="#">Enforcement</a>
        </li>
        </ul>
    </div>
    <HwcrComplaintTableHeader handleSort={handleSort}/>
    <HwcrComplaintTable sortColumn={sortColumn} sortOrder={sortOrder} /></>
    ;
}