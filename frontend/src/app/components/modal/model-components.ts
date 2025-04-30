import {
  Sample,
  ASSIGN_OFFICER,
  CHANGE_STATUS,
  CANCEL_CONFIRM,
  DELETE_NOTE,
  DELETE_ANIMAL_OUTCOME,
  DELETE_CONFIRM,
  QUICK_CLOSE,
  TOGGLE_DEACTIVATE,
  REFER_COMPLAINT,
  MANAGE_COLLABORATORS,
  MAP_MODAL,
} from "@apptypes/modal/modal-types";

import {
  SampleModal,
  AssignOfficerModal,
  ChangeStatusModal,
  DeleteNoteModal,
  DeleteAnimalOutcomeModal,
  DeleteConfirmModalV2,
  QuickCloseModal,
  ToggleDeactivateModal,
  ReferComplaintModal,
  ManageCollaboratorsModal,
} from "./instances";
import { CancelConfirmModal } from "./instances/cancel-confirm-modal";
import { MapModal } from "@/app/components/modal/instances/map-modal";

export const MODAL_COMPONENTS: { [key: string]: React.ComponentType<any> } = {
  [Sample]: SampleModal,
  [ASSIGN_OFFICER]: AssignOfficerModal,
  [CHANGE_STATUS]: ChangeStatusModal,
  [CANCEL_CONFIRM]: CancelConfirmModal,
  [DELETE_NOTE]: DeleteNoteModal,
  [DELETE_ANIMAL_OUTCOME]: DeleteAnimalOutcomeModal,
  [DELETE_CONFIRM]: DeleteConfirmModalV2,
  [QUICK_CLOSE]: QuickCloseModal,
  [TOGGLE_DEACTIVATE]: ToggleDeactivateModal,
  [REFER_COMPLAINT]: ReferComplaintModal,
  [MANAGE_COLLABORATORS]: ManageCollaboratorsModal,
  [MAP_MODAL]: MapModal,
};
