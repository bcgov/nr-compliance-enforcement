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
  LegislationSource,
  CreateLegislationSourceInput,
  UpdateLegislationSourceInput,
} from "@/app/graphql/hooks/useLegislationSourceQuery";

interface EditingSource {
  legislationSourceGuid?: string;
  shortDescription: string;
  longDescription: string;
  sourceUrl: string;
  agencyCode: string;
  activeInd: boolean;
  importedInd: boolean;
}

const emptySource: EditingSource = {
  shortDescription: "",
  longDescription: "",
  sourceUrl: "",
  agencyCode: "",
  activeInd: true,
  importedInd: false,
};

export const LegislationSourceManagement: FC = () => {
  const { data: sources, isLoading, refetch } = useLegislationSources();
  const agencies = useAppSelector(selectAgencyDropdown);

  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState<EditingSource>(emptySource);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmGuid, setDeleteConfirmGuid] = useState<string | null>(null);

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

  const filteredSources = useMemo(() => {
    if (!sources) return [];
    if (!searchQuery) return sources;
    const query = searchQuery.toLowerCase();
    return sources.filter(
      (source) =>
        source.shortDescription.toLowerCase().includes(query) ||
        source.longDescription?.toLowerCase().includes(query) ||
        source.sourceUrl.toLowerCase().includes(query) ||
        source.agencyCode.toLowerCase().includes(query),
    );
  }, [sources, searchQuery]);

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
      agencyCode: source.agencyCode,
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
        agencyCode: editingSource.agencyCode,
      };
      createMutation.mutate({ input });
    }
  };

  const handleDelete = (guid: string) => {
    deleteMutation.mutate({ legislationSourceGuid: guid });
  };

  const getAgencyLabel = (code: string) => {
    const agency = agencies.find((a) => a.value === code);
    return agency?.label ?? code;
  };

  return (
    <div className="comp-page-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Legislation Sources</h1>
        </div>
        <p>BC Laws XML document sources for import into the legislation tables.</p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: "400px" }}
            placeholder="Search by description, URL, or agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="primary"
            onClick={handleOpenCreate}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Add Source
          </Button>
        </div>

        <div className="comp-table">
          <Table
            bordered
            hover
          >
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th>Description</th>
                <th style={{ width: "130px" }}>Agency</th>
                <th>Source URL</th>
                <th style={{ width: "100px", textAlign: "center" }}>Status</th>
                <th style={{ width: "160px" }}>Last Import</th>
                <th style={{ width: "90px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
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
              ) : filteredSources.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-4"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      <span>{searchQuery ? "No matching sources found" : "No legislation sources configured"}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSources.map((source, i) => (
                  <tr key={source.legislationSourceGuid}>
                    <td style={{ textAlign: "center" }}>{i + 1}</td>
                    <td>
                      {source.shortDescription}
                      {source.longDescription && <div className="text-muted">{source.longDescription}</div>}
                    </td>
                    <td>{getAgencyLabel(source.agencyCode)}</td>
                    <td className="text-truncate">
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="comp-cell-link"
                        title={source.sourceUrl}
                      >
                        {source.sourceUrl}
                      </a>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {!source.activeInd ? (
                        <span className="badge comp-status-badge-closed">Inactive</span>
                      ) : source.importedInd ? (
                        <span className="badge comp-status-badge-open">Imported</span>
                      ) : (
                        <span className="badge comp-status-badge-pending-review">Pending</span>
                      )}
                    </td>
                    <td>{formatDateTime(source.lastImportTimestamp)}</td>
                    <td style={{ textAlign: "center" }}>
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
                            modifiers: [
                              {
                                name: "offset",
                                options: {
                                  offset: [0, 13],
                                  placement: "start",
                                },
                              },
                            ],
                          }}
                        >
                          <Dropdown.Item onClick={() => handleOpenEdit(source)}>
                            <i className="bi bi-pencil" /> Edit
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
                ))
              )}
            </tbody>
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
                  placeholder="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/.../xml"
                  value={editingSource.sourceUrl}
                  onChange={(e: any) => setEditingSource({ ...editingSource, sourceUrl: e.target.value })}
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
                  options={agencies}
                  value={agencies.find((a: Option) => a.value === editingSource.agencyCode) || null}
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
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Source"}
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
        <Modal.Body>Are you sure you want to delete this legislation source? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
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
    </div>
  );
};
