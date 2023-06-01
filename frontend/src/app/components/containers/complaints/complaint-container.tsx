import { FC } from "react";
import { HwcrComplaintTabContainer } from "./hwcr/hwcr-complaint-tab-container";

export const HwcrComplaintContainer: FC = () => {
    return <><div className="comp-hwcr-header">Complaints</div>
        <HwcrComplaintTabContainer/>
    </>
    ;
}