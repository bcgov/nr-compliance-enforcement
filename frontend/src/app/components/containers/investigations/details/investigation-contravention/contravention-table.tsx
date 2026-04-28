import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { CompTable } from "@components/common/comp-table";
import { CompColumn } from "@/app/types/app/comp-tables";
import { Contravention } from "@/generated/graphql";
import { formatDate, parseUTCDateTimeToLocal } from "@/app/common/methods";
import { LegislationText } from "@/app/components/common/legislation-text";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { useAppSelector } from "@/app/hooks/hooks";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";

interface ContraventionTableProps {
  contraventions: Contravention[];
  investigationGuid: string;
  partyGuid: string | null;
  onView: (contraventionId: string, partyGuid: string | null) => void;
  onEdit: (contraventionId: string, partyGuid: string | null) => void;
}

// Thin wrapper so each row can call the legislation hook independently
const LegislationCell: FC<{ legislationIdentifierRef: string }> = ({ legislationIdentifierRef }) => {
  const legislation = useLegislation(legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;

  if (!legislationData) return <span>Loading...</span>;

  const displayText = legislationData.alternateText ?? legislationData.legislationText;
  return (
    <>
      {legislationData.fullCitation} : <LegislationText>{displayText}</LegislationText>
    </>
  );
};

export const ContraventionTable: FC<ContraventionTableProps> = ({
  contraventions,
  investigationGuid,
  partyGuid,
  onView,
  onEdit,
}) => {
  const areaCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.AREA_CODES));

  const columns: CompColumn<Contravention>[] = [
    {
      label: "Contravention",
      headerClassName: "",
      cellClassName: "",
      isSortable: false,
      getValue: (c) => c.legislationIdentifierRef ?? "",
      renderCell: (c) => (
        <button
          type="button"
          className="btn btn-link p-0 text-start"
          onClick={() => {
            onView(c.contraventionIdentifier, partyGuid);
          }}
        >
          <LegislationCell legislationIdentifierRef={c.legislationIdentifierRef} />
        </button>
      ),
    },
    {
      label: "Date",
      sortKey: "date",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: true,
      getValue: (c) => c.date ?? "",
      renderCell: (c) => formatDate(parseUTCDateTimeToLocal(c.date, null)?.toString()),
    },
    {
      label: "Community",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: false,
      getValue: (c) => c.community ?? "",
      renderCell: (c) => {
        const community = areaCodes.find((item) => item.area === c.community);
        return community?.areaName ?? "-";
      },
    },
    {
      label: "Enforcement Action",
      headerClassName: "comp-cell-width-160 comp-cell-min-width-160",
      cellClassName: "comp-cell-width-160 comp-cell-min-width-160",
      isSortable: false,
      getValue: () => "",
      renderCell: () => "-",
    },
    {
      label: "Status",
      headerClassName: "comp-cell-width-110",
      cellClassName: "comp-cell-width-110",
      isSortable: false,
      getValue: () => "",
      renderCell: () => "-",
    },
    {
      label: "Actions",
      headerClassName:
        "sticky-col sticky-col--right comp-cell-width-90 comp-cell-min-width-90 actions-col case-table-actions-cell",
      cellClassName:
        "comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col case-table-actions-cell",
      isSortable: false,
      getValue: () => "",
      renderCell: (c) => (
        <div className="d-flex justify-content-end">
          <Dropdown
            id={`contravention-action-button-${c.contraventionIdentifier}`}
            drop="start"
            className="comp-action-dropdown"
          >
            <Dropdown.Toggle
              id={`contravention-action-toggle-${c.contraventionIdentifier}`}
              size="sm"
              variant="outline-primary"
              bsPrefix="btn btn-outline-primary btn-sm comp-kebab-toggle"
              className="comp-cell-width-30 comp-cell-height-30 d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-three-dots-vertical comp-padding-left-6" />
            </Dropdown.Toggle>
            <Dropdown.Menu
              popperConfig={{
                modifiers: [{ name: "offset", options: { offset: [0, 8], placement: "start" } }],
              }}
            >
              <Dropdown.Item
                id={`edit-contravention-${c.contraventionIdentifier}`}
                onClick={() => onEdit(c.contraventionIdentifier, partyGuid)}
              >
                <i className="bi bi-pencil" /> Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <CompTable
      data={contraventions}
      defaultSort="date"
      tableIdentifier={`contravention-table-${investigationGuid}`}
      isFixedHeight={false}
      columns={columns}
      getRowKey={(c) => c.contraventionIdentifier ?? ""}
      emptyMessage="No contraventions found."
    />
  );
};
