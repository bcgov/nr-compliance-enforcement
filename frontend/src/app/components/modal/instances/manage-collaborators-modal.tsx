import { FC, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { selectModalData } from "@store/reducers/app";
import { AgencyBanner } from "@components/containers/layout/agency-banner";
import { CODE_TABLE_TYPES } from "@constants/code-table-types";
import { selectAgenciesWithFeature, selectCodeTable } from "@store/reducers/code-table";
import { filterOfficerByAgency, selectOfficers, toOfficerOption } from "@store/reducers/officer";
import { AppUser } from "@/app/types/app/app_user/app_user";
import { Roles } from "@/app/types/app/roles";
import COMPLAINT_TYPES from "@/app/types/app/complaint-types";
import {
  addCollaboratorToComplaint,
  getComplaintCollaboratorsByComplaintId,
  removeCollaboratorFromComplaint,
  selectComplaint,
  selectActiveComplaintCollaborators,
} from "@/app/store/reducers/complaints";
import { FEATURE_TYPES } from "@/app/constants/feature-flag-types";
import { AgencyType } from "@/app/types/app/agency-types";
import { CollaboratorsForm } from "@/app/components/common/collaborators-form";

type ManageCollaboratorsModalProps = {
  submit: () => void;
  complaintId: string;
  complaintType: string;
};

export const ManageCollaboratorsModal: FC<ManageCollaboratorsModalProps> = ({ submit, complaintId, complaintType }) => {
  const dispatch = useAppDispatch();
  const modalData = useAppSelector(selectModalData);
  const agencies = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AGENCY));
  const complaintAgencies = useAppSelector((state) => selectAgenciesWithFeature(state, FEATURE_TYPES.COMPLAINTS));
  const complaintData = useAppSelector(selectComplaint);

  const { title, onDirtyChange } = modalData;

  useEffect(() => {
    dispatch(getComplaintCollaboratorsByComplaintId(complaintId));
  }, [complaintId, dispatch]);
  const collaborators = useAppSelector(selectActiveComplaintCollaborators);

  const allOfficers = useAppSelector(selectOfficers);
  // Get officers for the selected agency
  const getUserOptions = (agency: string) =>
    filterOfficerByAgency(agency, allOfficers ?? [])
      .filter(
        (officer: AppUser) => complaintType === COMPLAINT_TYPES.HWCR || !officer.user_roles.includes(Roles.HWCR_ONLY),
      )
      .filter((officer) => !collaborators.some((c) => c.appUserGuid === officer.app_user_guid)) // Keep the officer if the complaint type is HWCR or if they don't have the HWCR_ONLY role for non-HWCR.
      .map((officer: AppUser) => toOfficerOption(officer));

  const agencyOptions = agencies
    .filter(
      (agency) =>
        complaintAgencies.includes(agency.agency) &&
        agency.agency !== complaintData?.ownedBy &&
        agency.agency !== AgencyType.SECTOR,
    )
    .map((agency) => ({
      label: agency.longDescription,
      labelElement: <AgencyBanner agency={agency.agency} />,
      value: agency.agency,
    }));

  const handleAddCollaborator = (appUserGuid: string) => {
    const complaintUrl = window.location.href;
    dispatch(addCollaboratorToComplaint(complaintId, appUserGuid, complaintType, complaintUrl));
  };

  const handleRemoveCollaborator = (appUserGuid: string) => {
    const collaborator = collaborators.find((c) => c.appUserGuid === appUserGuid);
    if (collaborator) {
      dispatch(removeCollaboratorFromComplaint(complaintId, collaborator.appUserComplaintXrefGuid));
    }
  };

  return (
    <>
      {title && (
        <Modal.Header closeButton={true}>
          <Modal.Title as="h1">{`${title}`}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <CollaboratorsForm
          agencyOptions={agencyOptions}
          getUserOptions={getUserOptions}
          collaborators={collaborators}
          onAdd={handleAddCollaborator}
          onRemove={handleRemoveCollaborator}
          onDirtyChange={onDirtyChange}
          submit={submit}
        />
      </Modal.Body>
    </>
  );
};
