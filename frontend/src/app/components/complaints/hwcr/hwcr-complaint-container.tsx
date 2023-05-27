import { FC } from "react";
import "./hwcr-complaint.scss";
import { HwcrComplaintTabContainer } from "./hwcr-complaint-tab-container";

export const HwcrComplaintContainer: FC = () => {
    return <><div className="comp-hwcr-header">Complaints</div>
    <br/>
    <HwcrComplaintTabContainer/></>
    ;
}