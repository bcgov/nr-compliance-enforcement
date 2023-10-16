import {
  Sample,
  AssignOfficer,
  ChangeStatus,
  CancelConfirm,
} from "../../types/modal/modal-types";

import {
  SampleModal,
  AssignOfficerModal,
  ChangeStatusModal,
} from "./instances";
import { CancelConfirmModal } from "./instances/cancel-confirm-modal";

export const MODAL_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  [Sample]: SampleModal,
  [AssignOfficer]: AssignOfficerModal,
  [ChangeStatus]: ChangeStatusModal,
  [CancelConfirm]: CancelConfirmModal,
};
