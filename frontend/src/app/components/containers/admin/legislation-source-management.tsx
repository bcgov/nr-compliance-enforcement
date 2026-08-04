import { FC, useState, useMemo } from "react";
import { Button, Modal, Dropdown } from "react-bootstrap";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { useAppSelector } from "@hooks/hooks";
import { selectAgencySectorDropdown } from "@store/reducers/code-table";
import { CompInput } from "@components/common/comp-input";
import { CompSelect } from "@components/common/comp-select";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@apptypes/app/comp-tables";
import { SORT_TYPES } from "@constants/sort-direction";
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
import { useLegislationVersions } from "@/app/graphql/hooks/useLegislationVersionQuery";
import { LegislationVersionHistory } from "@/app/components/containers/admin/legislation-version-history";
import { ValidationDatePicker } from "@/app/common/validation-date-picker";
import { formatDateObjectAsString } from "@/app/common/date-utils";
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
  effectiveDate: Date | undefined;
}

const emptySource: EditingSource = {
  shortDescription: "",
  longDescription: "",
  sourceUrl: "",
  regulationsSourceUrl: "",
  agencyCode: "",
  sourceType: "BCLAWS",
  activeInd: true,
  effectiveDate: new Date(1900, 0, 1),
};

const sourceTypeOptions: Option[] = [
  { value: "BCLAWS", label: "BC Laws" },
  { value: "FEDERAL", label: "Federal" },
];

type SourceActionsProps = {
  source: LegislationSource;
  onEdit: (source: LegislationSource) => void;
  onDelete: (legislationSourceGuid: string) => void;
};

const LegislationSourceActions: FC<SourceActionsProps> = ({ source, onEdit, onDelete }) => {
  const { data: versions } = useLegislationVersions(source.legislationSourceGuid);
  const hasImportedVersion = !!versions?.some((version) => version.importStatus === "SUCCESS");

  return (
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
          onClick={() => onEdit(source)}
          disabled={hasImportedVersion}
          title={hasImportedVersion ? "Sources with imported legislation cannot be edited." : undefined}
        >
          <i className="bi bi-pencil" /> Edit
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to={`/admin/law/${source.legislationSourceGuid}?agencyCode=${source.agencyCode}`}
          disabled={!hasImportedVersion}
          title={hasImportedVersion ? undefined : "Import a version before configuring the legislation."}
        >
          <i className="bi bi-gear" /> Configure
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => onDelete(source.legislationSourceGuid)}
          className="text-danger"
        >
          <i className="bi bi-trash" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const LegislationSourceManagement: FC = () => {
  const { data: sources, isLoading, refetch } = useLegislationSources();
  const agencies = useAppSelector(selectAgencySectorDropdown);

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

  const isGlobalAdmin = UserService.hasRole(Roles.GLOBAL_ADMINISTRATOR);
  const userAgency = UserService.getUserAgency();
  const allowedAgencies = useMemo(() => new Set([userAgency, AgencyType.SECTOR]), [userAgency]);
  const agencyList = agencies?.filter((agency) => (isGlobalAdmin ? true : allowedAgencies.has(agency.value)));

  // Only show Act sources; the regulations imported under them carry a parent source
  const actSources = useMemo(() => {
    if (!sources) return [];

    let result = sources.filter((source) => source.parentLegislationSourceGuid == null);

    // Restrict by agency if not global admin
    if (!isGlobalAdmin) {
      result = result.filter((source) => allowedAgencies.has(source.agencyCode));
    }

    return result;
  }, [sources, isGlobalAdmin, allowedAgencies]);

  const filteredSources = useMemo(() => {
    if (!searchQuery) return actSources;
    const query = searchQuery.toLowerCase();
    return actSources.filter(
      (source) =>
        source.shortDescription.toLowerCase().includes(query) ||
        source.longDescription?.toLowerCase().includes(query) ||
        source.sourceUrl?.toLowerCase().includes(query) ||
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
      sourceUrl: source.sourceUrl ?? "",
      regulationsSourceUrl: source.regulationsSourceUrl ?? "",
      agencyCode: source.agencyCode,
      sourceType: source.sourceType ?? "BCLAWS",
      activeInd: source.activeInd,
      effectiveDate: undefined,
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
        effectiveDate: formatDateObjectAsString(editingSource.effectiveDate, { format: "date" }) || undefined,
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

  const getStatusBadge = (source: LegislationSource) => {
    if (!source.activeInd) return <span className="badge comp-status-badge-closed">Inactive</span>;
    return <span className="badge comp-status-badge-open">Active</span>;
  };

  const getSaveButtonText = () => {
    if (createMutation.isPending || updateMutation.isPending) return "Saving...";
    return isEditing ? "Save Changes" : "Add Source";
  };

  const columns: CompColumn<LegislationSource>[] = [
    {
      label: "Description",
      isSortable: true,
      getValue: (source) => source.shortDescription.toLowerCase(),
      renderCell: (source) => (
        <>
          {source.shortDescription}
          {source.longDescription && <div className="text-muted">{source.longDescription}</div>}
        </>
      ),
    },
    {
      label: "Type",
      headerClassName: "comp-cell-width-100",
      cellClassName: "comp-cell-width-100",
      isSortable: true,
      getValue: (source) => source.sourceType,
      renderCell: (source) =>
        sourceTypeOptions.find((option) => option.value === source.sourceType)?.label ?? source.sourceType,
    },
    {
      label: "Agency",
      headerClassName: "comp-cell-width-130",
      cellClassName: "comp-cell-width-130",
      isSortable: true,
      getValue: (source) => getAgencyLabel(source.agencyCode),
      renderCell: (source) => getAgencyLabel(source.agencyCode),
    },
    {
      label: "Source URLs",
      renderCell: (source) => (
        <>
          {source.sourceUrl && (
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
          )}
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
        </>
      ),
    },
    {
      label: "Status",
      headerClassName: "comp-cell-width-100 text-center",
      cellClassName: "comp-cell-width-100 text-center",
      isSortable: true,
      getValue: (source) => String(source.activeInd),
      renderCell: (source) => getStatusBadge(source),
    },
    {
      label: "Actions",
      headerClassName: "comp-cell-width-90 text-center",
      cellClassName: "comp-cell-width-90 text-center",
      renderCell: (source) => (
        <LegislationSourceActions
          source={source}
          onEdit={handleOpenEdit}
          onDelete={setDeleteConfirmGuid}
        />
      ),
    },
  ];

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

        <CompTable
          data={filteredSources}
          tableIdentifier="legislation-source-list"
          isFixedHeight={false}
          columns={columns}
          getRowKey={(source) => source.legislationSourceGuid}
          renderExpandedContent={(source) => (
            <LegislationVersionHistory legislationSourceGuid={source.legislationSourceGuid} />
          )}
          isLoading={isLoading}
          defaultSort="Description"
          defaultSortDirection={SORT_TYPES.ASC}
          alwaysShowFooter={false}
          itemLabel="sources"
          emptyMessage={searchQuery ? "No matching sources found" : "No legislation sources configured"}
        />
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
                  maxLength={256}
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

            {!isEditing && (
              <div className="comp-details-form-row">
                <label htmlFor="effective-date-input-date">Effective date</label>
                <div className="comp-details-edit-input">
                  <ValidationDatePicker
                    id="effective-date-input"
                    classNamePrefix="comp-details-input"
                    className="comp-form-control comp-details-input"
                    errMsg=""
                    selectedDate={editingSource.effectiveDate}
                    showYearDropdown={true}
                    onChange={(date: Date | undefined) => setEditingSource({ ...editingSource, effectiveDate: date })}
                  />
                </div>
              </div>
            )}

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
    </div>
  );
};
