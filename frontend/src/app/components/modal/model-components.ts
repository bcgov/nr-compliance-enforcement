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
  LINK_COMPLAINT,
  ADD_COMPLAINT_TO_CASE,
  CREATE_ADD_CASE,
  ADD_PARTY,
  REMOVE_PARTY,
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
  RemovePartyModal,
} from "./instances";
import { CancelConfirmModal } from "./instances/cancel-confirm-modal";
import { MapModal } from "@/app/components/modal/instances/map-modal";
import { LinkComplaintModal } from "./instances/link-complaint-modal";
import { AddComplaintToCaseModal } from "./instances/add-complaint-to-case";
import { CreateAddCaseModal } from "@/app/components/modal/instances/create-add-case";
import { AddPartyModal } from "@/app/components/modal/instances/add-party";

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
  [LINK_COMPLAINT]: LinkComplaintModal,
  [ADD_COMPLAINT_TO_CASE]: AddComplaintToCaseModal,
  [CREATE_ADD_CASE]: CreateAddCaseModal,
  [ADD_PARTY]: AddPartyModal,
  [REMOVE_PARTY]: RemovePartyModal,
};
