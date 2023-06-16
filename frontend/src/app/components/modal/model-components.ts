import { Sample } from "../../types/modal/modal-types"

import { SampleModal } from "./instances"

 export const MODAL_COMPONENTS: {[key: string]: React.ComponentType<any>} = {
    [Sample]: SampleModal,
}