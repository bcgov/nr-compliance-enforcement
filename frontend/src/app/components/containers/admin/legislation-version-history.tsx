import { FC, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useAppDispatch } from "@hooks/hooks";
import { openModal } from "@store/reducers/app";
import { DELETE_CONFIRM } from "@apptypes/modal/modal-types";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { formatDateObjectAsString, parseUTCDateToLocal, parseUTCTimestampToLocal } from "@/app/common/date-utils";
import {
  ImportStatus,
  LegislationVersion,
  useCreateLegislationVersion,
  useDeleteLegislationVersion,
  useLegislationVersionContraventionStats,
  useLegislationVersions,
  useResetLegislationVersion,
  useUpdateLegislationVersion,
} from "@/app/graphql/hooks/useLegislationVersionQuery";

const EMPTY = "—";

const getImportStatusBadge = (importStatus: ImportStatus) => {
  if (importStatus === "SUCCESS") return <span className="badge comp-status-badge-open">Imported</span>;
  if (importStatus === "FAILED") return <span className="badge bg-danger">Failed</span>;
  return <span className="badge comp-status-badge-pending-review">Pending</span>;
};

const displayDate = (date: string | null | undefined) =>
  formatDateObjectAsString(parseUTCDateToLocal(date, null), { format: "date", whenAbsent: EMPTY });

const toPickerDate = (date: string | null | undefined) => parseUTCDateToLocal(date, null) ?? undefined;

const addDays = (date: string, days: number): string => {
  const shifted = parseUTCDateToLocal(date, null)!;
  shifted.setDate(shifted.getDate() + days);
  return formatDateObjectAsString(shifted, { format: "date" });
};

// The supplied dates in ascending order, ignoring the ones that are absent
const sortDates = (...dates: (string | null | undefined)[]): string[] =>
  dates.filter((date): date is string => !!date).sort();

const unwrapError = (error: any, fallback: string) => error?.response?.errors?.[0]?.message ?? fallback;

type RowProps = {
  version: LegislationVersion;
  precedingVersion: LegislationVersion | null;
  nextVersion: LegislationVersion | null;
  effectiveUntil: string | null;
  isInEffect: boolean;
  isNewestImported: boolean;
};

const LegislationVersionRow: FC<RowProps> = ({
  version,
  precedingVersion,
  nextVersion,
  effectiveUntil,
  isInEffect,
  isNewestImported,
}) => {
  const dispatch = useAppDispatch();
  const [showLog, setShowLog] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState<Date | undefined>();

  const { data: stats } = useLegislationVersionContraventionStats(version.legislationVersionGuid);
  const { data: precedingStats } = useLegislationVersionContraventionStats(precedingVersion?.legislationVersionGuid);

  const updateMutation = useUpdateLegislationVersion({
    onSuccess: () => {
      ToggleSuccess("Effective date updated");
      setIsEditingDate(false);
    },
    onError: (error: any) => ToggleError(unwrapError(error, "Failed to update the effective date")),
  });

  const resetMutation = useResetLegislationVersion({
    onSuccess: () => ToggleSuccess("Version reset"),
    onError: (error: any) => ToggleError(unwrapError(error, "Failed to reset the version")),
  });

  const deleteMutation = useDeleteLegislationVersion({
    onSuccess: () => ToggleSuccess("Version deleted"),
    onError: (error: any) => ToggleError(unwrapError(error, "Failed to delete the version")),
  });

  const isImported = version.importStatus === "SUCCESS";
  const contraventionCount = stats?.count ?? 0;

  let dateBlockedReason: string | undefined;
  if (isImported && !isNewestImported && precedingVersion) {
    dateBlockedReason = "Only the newest and the earliest imported version's effective date can be changed.";
  }

  let removeBlockedReason: string | undefined;
  if (contraventionCount > 0) {
    removeBlockedReason = `This version is referenced by ${contraventionCount} recorded contravention(s).`;
  } else if (isImported && !isNewestImported) {
    removeBlockedReason = "Only the newest imported version can be reset or deleted.";
  }

  const minEffectiveDate = precedingVersion
    ? addDays(sortDates(precedingVersion.effectiveDate, precedingStats?.latest).at(-1)!, 1)
    : undefined;
  const maxEffectiveDate = sortDates(
    stats?.earliest,
    nextVersion ? addDays(nextVersion.effectiveDate, -1) : undefined,
  ).at(0);

  const confirmReset = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_CONFIRM,
        data: {
          title: "Reset version?",
          description: `The legislation imported for ${displayDate(version.effectiveDate)} will be removed and the version returned to pending, ready to be imported again. The source stays active.`,
          confirmText: "reset version",
          deleteConfirmed: () => resetMutation.mutate({ legislationVersionGuid: version.legislationVersionGuid }),
        },
      }),
    );
  };

  const confirmDelete = () => {
    dispatch(
      openModal({
        modalSize: "md",
        modalType: DELETE_CONFIRM,
        data: {
          title: "Delete version?",
          description: `The version effective ${displayDate(version.effectiveDate)} and the legislation imported for it will be removed. This cannot be undone.`,
          confirmText: "delete version",
          deleteConfirmed: () => deleteMutation.mutate({ legislationVersionGuid: version.legislationVersionGuid }),
        },
      }),
    );
  };

  const saveEffectiveDate = () => {
    if (!editedDate) return;
    updateMutation.mutate({
      legislationVersionGuid: version.legislationVersionGuid,
      effectiveDate: formatDateObjectAsString(editedDate, { format: "date" }),
    });
  };

  return (
    <>
      <tr>
        <td>
          {displayDate(version.effectiveDate)}
          {isInEffect && <span className="badge comp-status-badge-open ms-2">Current</span>}
        </td>
        <td>{displayDate(effectiveUntil)}</td>
        <td>{getImportStatusBadge(version.importStatus)}</td>
        <td>
          {formatDateObjectAsString(parseUTCTimestampToLocal(version.lastImportTimestamp), {
            format: "dateTime",
            whenAbsent: "Never",
          })}
        </td>
        <td>
          {version.lastImportLog && (
            <Button
              variant="link"
              size="sm"
              className="p-0 me-3"
              onClick={() => setShowLog(true)}
            >
              View log
            </Button>
          )}
          <span title={dateBlockedReason}>
            <Button
              variant="link"
              size="sm"
              className="p-0 me-3"
              disabled={!!dateBlockedReason}
              onClick={() => {
                setEditedDate(toPickerDate(version.effectiveDate));
                setIsEditingDate(true);
              }}
            >
              Edit date
            </Button>
          </span>
          <span title={removeBlockedReason}>
            <Button
              variant="link"
              size="sm"
              className="p-0 me-3"
              disabled={!!removeBlockedReason}
              onClick={confirmReset}
            >
              Reset
            </Button>
          </span>
          <span title={removeBlockedReason}>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-danger"
              disabled={!!removeBlockedReason}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </span>
        </td>
      </tr>

      <Modal
        show={isEditingDate}
        onHide={() => setIsEditingDate(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit effective date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comp-details-form">
            <div className="comp-details-form-row">
              <label htmlFor={`version-effective-date-${version.legislationVersionGuid}-date`}>Effective date</label>
              <div className="comp-details-edit-input">
                <ValidationDatePicker
                  id={`version-effective-date-${version.legislationVersionGuid}`}
                  classNamePrefix="comp-details-input"
                  className="comp-form-control comp-details-input"
                  errMsg=""
                  selectedDate={editedDate}
                  minDate={toPickerDate(minEffectiveDate)}
                  maxDate={toPickerDate(maxEffectiveDate)}
                  showYearDropdown={true}
                  onChange={(date: Date | undefined) => setEditedDate(date)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setIsEditingDate(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={saveEffectiveDate}
            disabled={!editedDate || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showLog}
        onHide={() => setShowLog(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Import Log - {displayDate(version.effectiveDate)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Status:</strong> {getImportStatusBadge(version.importStatus)}
          </div>
          <div className="mb-3">
            <strong>Last Import:</strong>{" "}
            {formatDateObjectAsString(parseUTCTimestampToLocal(version.lastImportTimestamp), {
              format: "dateTime",
              whenAbsent: "Never",
            })}
          </div>
          <div>
            <strong>Log:</strong>
            <pre className="mt-2 p-3 bg-light border rounded overflow-auto text-break comp-log-viewer">
              {version.lastImportLog}
            </pre>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setShowLog(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

type Props = {
  legislationSourceGuid: string;
};

export const LegislationVersionHistory: FC<Props> = ({ legislationSourceGuid }) => {
  const { data: versions, isLoading } = useLegislationVersions(legislationSourceGuid);
  const [newEffectiveDate, setNewEffectiveDate] = useState<Date | undefined>();
  const [isAddingVersion, setIsAddingVersion] = useState(false);

  const createMutation = useCreateLegislationVersion({
    onSuccess: () => {
      ToggleSuccess("Version added");
      setIsAddingVersion(false);
    },
    onError: (error: any) => ToggleError(unwrapError(error, "Failed to add the version")),
  });

  const orderedVersions = [...(versions ?? [])].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  const importedVersions = orderedVersions.filter((version) => version.importStatus === "SUCCESS");
  const newestImportedVersion = importedVersions.at(-1);
  const today = new Date();
  const versionInEffect = importedVersions
    .filter((version) => parseUTCDateToLocal(version.effectiveDate, null)! <= today)
    .at(-1);

  const { data: newestStats } = useLegislationVersionContraventionStats(newestImportedVersion?.legislationVersionGuid);

  const nextEffectiveDate = newestImportedVersion
    ? toPickerDate(addDays(sortDates(newestImportedVersion.effectiveDate, newestStats?.latest).at(-1)!, 1))
    : today;

  const addBlockedReason = orderedVersions.every((version) => version.importStatus === "SUCCESS")
    ? undefined
    : "This source already has a version pending import. Import or delete it before adding another.";

  if (isLoading) {
    return <div>Loading versions...</div>;
  }

  return (
    <div className="pb-2">
      <h4>Version history</h4>
      <Table
        bordered
        size="sm"
      >
        <thead>
          <tr>
            <th>Effective date</th>
            <th>In effect until</th>
            <th className="comp-cell-width-100">Import status</th>
            <th className="comp-cell-width-160">Imported</th>
            <th className="comp-cell-width-260">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderedVersions.map((version) => {
            const isImported = version.importStatus === "SUCCESS";
            const nextImportedVersion = importedVersions.find(
              (candidate) => candidate.effectiveDate > version.effectiveDate,
            );
            // An imported version follows the one before it. A version still to be imported follows the newest.
            const precedingVersion = isImported
              ? importedVersions.filter((candidate) => candidate.effectiveDate < version.effectiveDate).at(-1)
              : newestImportedVersion;

            return (
              <LegislationVersionRow
                key={version.legislationVersionGuid}
                version={version}
                precedingVersion={precedingVersion ?? null}
                nextVersion={nextImportedVersion ?? null}
                effectiveUntil={
                  isImported && nextImportedVersion ? addDays(nextImportedVersion.effectiveDate, -1) : null
                }
                isInEffect={version.legislationVersionGuid === versionInEffect?.legislationVersionGuid}
                isNewestImported={version.legislationVersionGuid === newestImportedVersion?.legislationVersionGuid}
              />
            );
          })}
        </tbody>
      </Table>

      <span title={addBlockedReason}>
        <Button
          variant="outline-primary"
          size="sm"
          disabled={!!addBlockedReason}
          onClick={() => {
            setNewEffectiveDate(nextEffectiveDate);
            setIsAddingVersion(true);
          }}
        >
          <i className="bi bi-plus-lg me-1" /> Add version
        </Button>
      </span>

      <Modal
        show={isAddingVersion}
        onHide={() => setIsAddingVersion(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add version</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comp-details-form">
            <div className="comp-details-form-row">
              <label htmlFor={`add-version-${legislationSourceGuid}-date`}>Effective date</label>
              <div className="comp-details-edit-input">
                <ValidationDatePicker
                  id={`add-version-${legislationSourceGuid}`}
                  classNamePrefix="comp-details-input"
                  className="comp-form-control comp-details-input"
                  errMsg=""
                  selectedDate={newEffectiveDate}
                  minDate={nextEffectiveDate}
                  showYearDropdown={true}
                  onChange={(date: Date | undefined) => setNewEffectiveDate(date)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setIsAddingVersion(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!newEffectiveDate || createMutation.isPending}
            onClick={() =>
              createMutation.mutate({
                legislationSourceGuid,
                effectiveDate: formatDateObjectAsString(newEffectiveDate, { format: "date" }),
              })
            }
          >
            {createMutation.isPending ? "Saving..." : "Add version"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
