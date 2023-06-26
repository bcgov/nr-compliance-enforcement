import { Sample, AssignOfficer, ChangeStatus } from "../../types/modal/modal-types"

import { SampleModal, AssignOfficerModal, ChangeStatusModal } from "./instances"

 export const MODAL_COMPONENTS: {[key: string]: React.ComponentType<any>} = {
    [Sample]: SampleModal,
    [AssignOfficer]: AssignOfficerModal,
    [ChangeStatus]: ChangeStatusModal
}