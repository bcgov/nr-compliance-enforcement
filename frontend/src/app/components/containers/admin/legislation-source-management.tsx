import { FC, useState, useMemo } from "react";
import { Table, Button, Modal, Dropdown } from "react-bootstrap";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { formatDateTime } from "@common/methods";
import { useAppSelector } from "@hooks/hooks";
import { selectAgencyDropdown } from "@store/reducers/code-table";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import Option from "@apptypes/app/option";
import {
  useLegislationSources,
  useCreateLegislationSource,
  useUpdateLegislationSource,
  useDeleteLegislationSource,
  useResetLegislationSource,
  LegislationSource,
  CreateLegislationSourceInput,
  UpdateLegislationSourceInput,
} from "@/app/graphql/hooks/useLegislationSourceQuery";
import { Link } from "react-router-dom";
import UserService from "@/app/service/user-service";
import { Roles } from "@/app/types/app/roles";
import { AgencyType } from "@/app/types/app/agency-types";

interface EditingSource {
  legislationSourceGuid?: string;
  shortDescription: string;
  longDescription: string;
  sourceUrl: string;
  regulationsSourceUrl: string;
  agencyCode: string;
  sourceType: string;
  activeInd: boolean;
  importedInd: boolean;
}

const emptySource: EditingSource = {
  shortDescription: "",
  longDescription: "",
  sourceUrl: "",
  regulationsSourceUrl: "",
  agencyCode: "",
  sourceType: "BCLAWS",
  activeInd: true,
  importedInd: false,
};

const sourceTypeOptions: Option[] = [
  { value: "BCLAWS", label: "BC Laws" },
  { value: "FEDERAL", label: "Federal" },
];

export const LegislationSourceManagement: FC = () => {
  const { data: sources, isLoading, refetch } = useLegislationSources();
  const agencies = useAppSelector(selectAgencyDropdown);

  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState<EditingSource>(emptySource);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmGuid, setDeleteConfirmGuid] = useState<string | null>(null);
  const [resetConfirmGuid, setResetConfirmGuid] = useState<string | null>(null);
  const [viewLogSource, setViewLogSource] = useState<LegislationSource | null>(null);

  const createMutation = useCreateLegislationSource({
    onSuccess: () => {
      ToggleSuccess("Legislation source created successfully");
      handleCloseModal();
      refetch();
    },
    onError: (error: any) => {
      console.error("Error creating legislation source:", error);
      ToggleError(error?.response?.errors?.[0]?.message ?? "Failed to create legislation source");
    },
  });

  const updateMutation = useUpdateLegislationSource({
    onSuccess: () => {
      ToggleSuccess("Legislation source updated successfully");
      handleCloseModal();
      refetch();
    },
    onError: (error: any) => {
      console.error("Error updating legislation source:", error);
      ToggleError(error?.response?.errors?.[0]?.message ?? "Failed to update legislation source");
    },
  });

  const deleteMutation = useDeleteLegislationSource({
    onSuccess: () => {
      ToggleSuccess("Legislation source deleted successfully");
      setDeleteConfirmGuid(null);
      refetch();
    },
    onError: (error: any) => {
      console.error("Error deleting legislation source:", error);
      ToggleError(error?.response?.errors?.[0]?.message ?? "Failed to delete legislation source");
    },
  });

  const resetMutation = useResetLegislationSource({
    onSuccess: () => {
      ToggleSuccess("Legislation source reset successfully");
      setResetConfirmGuid(null);
      refetch();
    },
    onError: (error: any) => {
      console.error("Error resetting legislation source:", error);
      ToggleError(error?.response?.errors?.[0]?.message ?? "Failed to reset legislation source");
    },
  });

  const isGlobalAdmin = UserService.hasRole(Roles.GLOBAL_ADMINISTRATOR);
  const userAgency = UserService.getUserAgency();
  const agencyList = agencies?.filter((agency) => (isGlobalAdmin ? true : agency.value === userAgency));
  const allowedAgencies = new Set([userAgency, AgencyType.SECTOR]);

  // Only show Act sources (user-created); exclude regulation-only sources (system-created during import)
  const actSources = useMemo(() => {
    if (!sources) return [];

    let result = sources;

    // Restrict by agency if not global admin
    if (!isGlobalAdmin) {
      result = result.filter((source) => allowedAgencies.has(source.agencyCode));
    }

    return result;
  }, [sources]);

  const filteredSources = useMemo(() => {
    if (!searchQuery) return actSources;
    const query = searchQuery.toLowerCase();
    return actSources.filter(
      (source) =>
        source.shortDescription.toLowerCase().includes(query) ||
        source.longDescription?.toLowerCase().includes(query) ||
        source.sourceUrl.toLowerCase().includes(query) ||
        source.agencyCode.toLowerCase().includes(query),
    );
  }, [actSources, searchQuery]);

  const handleOpenCreate = () => {
    setEditingSource(emptySource);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (source: LegislationSource) => {
    setEditingSource({
      legislationSourceGuid: source.legislationSourceGuid,
      shortDescription: source.shortDescription,
      longDescription: source.longDescription ?? "",
      sourceUrl: source.sourceUrl,
      regulationsSourceUrl: source.regulationsSourceUrl ?? "",
      agencyCode: source.agencyCode,
      sourceType: source.sourceType ?? "BCLAWS",
      activeInd: source.activeInd,
      importedInd: source.importedInd,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSource(emptySource);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!editingSource.shortDescription || !editingSource.sourceUrl || !editingSource.agencyCode) {
      ToggleError("Please fill in all required fields");
      return;
    }

    if (isEditing && editingSource.legislationSourceGuid) {
      const input: UpdateLegislationSourceInput = {
        legislationSourceGuid: editingSource.legislationSourceGuid,
        shortDescription: editingSource.shortDescription,
        longDescription: editingSource.longDescription || undefined,
        sourceUrl: editingSource.sourceUrl,
        regulationsSourceUrl:
          editingSource.sourceType === "FEDERAL" ? undefined : editingSource.regulationsSourceUrl || undefined,
        agencyCode: editingSource.agencyCode,
        activeInd: editingSource.activeInd,
        importedInd: editingSource.importedInd,
      };
      updateMutation.mutate({ input });
    } else {
      const input: CreateLegislationSourceInput = {
        shortDescription: editingSource.shortDescription,
        longDescription: editingSource.longDescription || undefined,
        sourceUrl: editingSource.sourceUrl,
        regulationsSourceUrl:
          editingSource.sourceType === "FEDERAL" ? undefined : editingSource.regulationsSourceUrl || undefined,
        agencyCode: editingSource.agencyCode,
        sourceType: editingSource.sourceType,
      };
      createMutation.mutate({ input });
    }
  };

  const handleDelete = (guid: string) => {
    deleteMutation.mutate({ legislationSourceGuid: guid });
  };

  const handleReset = (guid: string) => {
    resetMutation.mutate({ legislationSourceGuid: guid });
  };

  const getAgencyLabel = (code: string) => {
    const agency = agencies.find((a) => a.value === code);
    return agency?.label ?? code;
  };

  const getStatusBadge = (source: LegislationSource) => {
    if (!source.activeInd) return <span className="badge comp-status-badge-closed">Inactive</span>;
    if (source.importStatus === "FAILED") return <span className="badge bg-danger">Failed</span>;
    if (source.importStatus === "SUCCESS" || source.importedInd) {
      return <span className="badge comp-status-badge-open">Imported</span>;
    }
    return <span className="badge comp-status-badge-pending-review">Pending</span>;
  };

  const getSaveButtonText = () => {
    if (createMutation.isPending || updateMutation.isPending) return "Saving...";
    return isEditing ? "Save Changes" : "Add Source";
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={8}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border spinner-border-sm me-2">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading legislation sources...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (filteredSources.length === 0) {
      return (
        <tr>
          <td
            colSpan={8}
            className="text-center p-4"
          >
            <div className="d-flex align-items-center justify-content-center">
              <i className="bi bi-info-circle-fill me-2" />
              <span>{searchQuery ? "No matching sources found" : "No legislation sources configured"}</span>
            </div>
          </td>
        </tr>
      );
    }

    return filteredSources.map((source, i) => (
      <tr key={source.legislationSourceGuid}>
        <td className="text-center">{i + 1}</td>
        <td>
          {source.shortDescription}
          {source.longDescription && <div className="text-muted">{source.longDescription}</div>}
        </td>
        <td>{sourceTypeOptions.find((o) => o.value === source.sourceType)?.label ?? source.sourceType}</td>
        <td>{getAgencyLabel(source.agencyCode)}</td>
        <td>
          <div>
            Act:
            <br />
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="comp-cell-link"
              title={source.sourceUrl}
            >
              {source.sourceUrl}
            </a>
          </div>
          {source.regulationsSourceUrl && (
            <div className="pt-3">
              Regulations:
              <br />
              <a
                href={source.regulationsSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="comp-cell-link"
                title={source.regulationsSourceUrl}
              >
                {source.regulationsSourceUrl}
              </a>
            </div>
          )}
        </td>
        <td className="text-center">{getStatusBadge(source)}</td>
        <td>{formatDateTime(source.lastImportTimestamp ?? undefined)}</td>
        <td className="text-center">
          <Dropdown
            id={`source-action-button-${source.legislationSourceGuid}`}
            drop="start"
            className="comp-action-dropdown"
          >
            <Dropdown.Toggle
              id={`source-action-toggle-${source.legislationSourceGuid}`}
              size="sm"
              variant="outline-primary"
            >
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu
              popperConfig={{
                modifiers: [{ name: "offset", options: { offset: [0, 13], placement: "start" } }],
              }}
            >
              <Dropdown.Item
                onClick={() => handleOpenEdit(source)}
                disabled={source.importedInd || source.importStatus === "SUCCESS"}
              >
                <i className="bi bi-pencil" /> Edit
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to={`/admin/law/${source.legislationSourceGuid}?agencyCode=${source.agencyCode}`}
                disabled={!source.importedInd}
              >
                <i className="bi bi-gear" /> Configure
              </Dropdown.Item>
              {source.lastImportLog && (
                <Dropdown.Item onClick={() => setViewLogSource(source)}>
                  <i className="bi bi-file-text" /> View Log
                </Dropdown.Item>
              )}
              <Dropdown.Item
                onClick={() => setResetConfirmGuid(source.legislationSourceGuid)}
                className="text-danger"
              >
                <i className="bi bi-arrow-counterclockwise" /> Reset Import
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setDeleteConfirmGuid(source.legislationSourceGuid)}
                className="text-danger"
              >
                <i className="bi bi-trash" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    ));
  };

  return (
    <div className="comp-page-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Legislation Sources</h1>
        </div>
        <p>Legislation document sources for import into the legislation tables.</p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control comp-filter-input"
            placeholder="Search by description, URL, or agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-plus-lg me-1" /> Add Source
          </Button>
        </div>

        <div className="comp-table">
          <Table
            bordered
            hover
          >
            <thead>
              <tr>
                <th className="comp-cell-width-50">#</th>
                <th>Description</th>
                <th className="comp-cell-width-100">Type</th>
                <th className="comp-cell-width-130">Agency</th>
                <th>Source URLs</th>
                <th className="comp-cell-width-100 text-center">Status</th>
                <th className="comp-cell-width-160">Last Import</th>
                <th className="comp-cell-width-90 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Legislation Source" : "Add Legislation Source"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="comp-details-form">
            <div className="comp-details-form-row">
              <label htmlFor="short-description-input">
                Short Description<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompInput
                  id="short-description-input"
                  divid="short-description-div"
                  type="input"
                  inputClass="comp-form-control"
                  placeholder="e.g., Environmental Management Act"
                  maxLength={64}
                  value={editingSource.shortDescription}
                  onChange={(e: any) => setEditingSource({ ...editingSource, shortDescription: e.target.value })}
                />
              </div>
            </div>

            <div className="comp-details-form-row">
              <label htmlFor="long-description-input">Long Description</label>
              <div className="comp-details-edit-input">
                <CompInput
                  id="long-description-input"
                  divid="long-description-div"
                  type="input"
                  inputClass="comp-form-control"
                  placeholder="Optional detailed description"
                  maxLength={256}
                  value={editingSource.longDescription}
                  onChange={(e: any) => setEditingSource({ ...editingSource, longDescription: e.target.value })}
                />
              </div>
            </div>

            <div className="comp-details-form-row">
              <label htmlFor="source-url-input">
                Source URL<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompInput
                  id="source-url-input"
                  divid="source-url-div"
                  type="input"
                  inputClass="comp-form-control"
                  placeholder="URL for the act XML document"
                  value={editingSource.sourceUrl}
                  onChange={(e: any) => setEditingSource({ ...editingSource, sourceUrl: e.target.value })}
                />
              </div>
            </div>

            {editingSource.sourceType !== "FEDERAL" && (
              <div className="comp-details-form-row">
                <label htmlFor="regulations-url-input">Regulations URL</label>
                <div className="comp-details-edit-input">
                  <CompInput
                    id="regulations-url-input"
                    divid="regulations-url-div"
                    type="input"
                    inputClass="comp-form-control"
                    placeholder="Optional URL for the regulations folder XML document"
                    value={editingSource.regulationsSourceUrl}
                    onChange={(e: any) => setEditingSource({ ...editingSource, regulationsSourceUrl: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="comp-details-form-row">
              <label htmlFor="source-type-select">
                Source Type<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompSelect
                  id="source-type-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={sourceTypeOptions}
                  value={sourceTypeOptions.find((o) => o.value === editingSource.sourceType) || sourceTypeOptions[0]}
                  onChange={(option: Option | null) =>
                    setEditingSource({ ...editingSource, sourceType: option?.value || "BCLAWS" })
                  }
                  placeholder="Select a source type..."
                  showInactive={false}
                  enableValidation={false}
                  isClearable={false}
                />
              </div>
            </div>

            <div className="comp-details-form-row">
              <label htmlFor="agency-select">
                Agency<span className="required-ind">*</span>
              </label>
              <div className="comp-details-edit-input">
                <CompSelect
                  id="agency-select"
                  classNamePrefix="comp-select"
                  className="comp-details-input"
                  options={agencyList}
                  value={agencyList.find((a: Option) => a.value === editingSource.agencyCode) || null}
                  onChange={(option: Option | null) =>
                    setEditingSource({ ...editingSource, agencyCode: option?.value || "" })
                  }
                  placeholder="Select an agency..."
                  showInactive={false}
                  enableValidation={false}
                  isClearable={true}
                />
              </div>
            </div>

            {isEditing && (
              <div className="comp-details-form-row">
                <label htmlFor="active-checkbox">Status</label>
                <div className="comp-details-edit-input">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="active-checkbox"
                      checked={editingSource.activeInd}
                      onChange={(e) => setEditingSource({ ...editingSource, activeInd: e.target.checked })}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="active-checkbox"
                    >
                      Active (inactive sources will not be imported)
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {getSaveButtonText()}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={!!deleteConfirmGuid}
        onHide={() => setDeleteConfirmGuid(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this legislation source? This will also delete all legislation records that
          were imported from this source. This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setDeleteConfirmGuid(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteConfirmGuid && handleDelete(deleteConfirmGuid)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!resetConfirmGuid}
        onHide={() => setResetConfirmGuid(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reset Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to reset this legislation source? This will delete all legislation records that were
          imported from this source and mark the source as inactive. This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setResetConfirmGuid(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => resetConfirmGuid && handleReset(resetConfirmGuid)}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? "Resetting..." : "Reset Import"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!viewLogSource}
        onHide={() => setViewLogSource(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Import Log - {viewLogSource?.shortDescription}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Status:</strong> {viewLogSource && getStatusBadge(viewLogSource)}
          </div>
          <div className="mb-3">
            <strong>Last Import:</strong> {formatDateTime(viewLogSource?.lastImportTimestamp ?? undefined) || "Never"}
          </div>
          <div>
            <strong>Log:</strong>
            <pre className="mt-2 p-3 bg-light border rounded overflow-auto text-break comp-log-viewer">
              {viewLogSource?.lastImportLog || "No log available"}
            </pre>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => setViewLogSource(null)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
