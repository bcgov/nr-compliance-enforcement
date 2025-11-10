export const Sample = "SAMPLE_MODAL";
export const YES_NO_MODAL = "YES_NO_MODAL";
export const OK = "OK_MODAL";
export const ASSIGN_OFFICER = "ASSIGN_OFFICER";
export const CHANGE_STATUS = "CHANGE_STATUS";
export const CANCEL_CONFIRM = "CANCEL_CONFIRM";
export const DELETE_NOTE = "DELETE_NOTE";
export const DELETE_ANIMAL_OUTCOME = "DELETE_ANIMAL_OUTCOME";
export const DELETE_CONFIRM = "DELETE_CONFIRM";
export const QUICK_CLOSE = "QUICK_CLOSE";
export const TOGGLE_DEACTIVATE = "TOGGLE_DEACTIVATE";
export const REFER_COMPLAINT = "REFER_COMPLAINT";
export const MANAGE_COLLABORATORS = "MANAGE_COLLABORATORS";
export const MAP_MODAL = "MAP_MODAL";
export const LINK_COMPLAINT = "LINK_COMPLAINT";
export const ADD_COMPLAINT_TO_CASE = "ADD_COMPLAINT_TO_CASE";
export const CREATE_ADD_CASE = "CREATE_ADD_CASE";
export const REMOVE_ACTIVITY_FROM_CASE = "REMOVE_ACTIVITY_FROM_CASE";
export const ADD_PARTY = "ADD_PARTY";

export interface ModalProps {
  modalType: string;
}
