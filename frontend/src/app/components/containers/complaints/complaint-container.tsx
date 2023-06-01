import { FC } from "react";
import "../../../../assets/sass/app.scss";
import { AllegationComplaintTabContainer } from "./allegations/allegation-complaint-tab-container";

export const HwcrComplaintContainer: FC = () => {
    return <><div className="comp-hwcr-header">Complaints</div>
        <AllegationComplaintTabContainer/>
    </>
    ;
}