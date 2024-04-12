import { Sample, ASSIGN_OFFICER, CHANGE_STATUS, CANCEL_CONFIRM, DELETE_NOTE } from "../../types/modal/modal-types";

import { SampleModal, AssignOfficerModal, ChangeStatusModal, DeleteNoteModal } from "./instances";
import { CancelConfirmModal } from "./instances/cancel-confirm-modal";

export const MODAL_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  [Sample]: SampleModal,
  [ASSIGN_OFFICER]: AssignOfficerModal,
  [CHANGE_STATUS]: ChangeStatusModal,
  [CANCEL_CONFIRM]: CancelConfirmModal,
  [DELETE_NOTE]: DeleteNoteModal,
};
