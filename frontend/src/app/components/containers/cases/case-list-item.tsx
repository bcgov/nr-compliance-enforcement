import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { applyStatusClass } from "@common/methods";

type Props = {
  caseFile: any;
};

export const CaseListItem: FC<Props> = ({ caseFile }) => {
  const renderDropdownAction = (caseFile: any, icon: string, label: string, to?: string, onClick?: () => void) => {
    const itemProps = {
      id: `${label.toLowerCase().replace(" ", "-")}-case-${caseFile.caseIdentifier}`,
      onClick,
    };

    return to ? (
      <Dropdown.Item
        as={Link}
        to={to}
        {...itemProps}
      >
        <i className={`bi bi-${icon}`} /> {label}
      </Dropdown.Item>
    ) : (
      <Dropdown.Item {...itemProps}>
        <i className={`bi bi-${icon}`} /> {label}
      </Dropdown.Item>
    );
  };

  return (
    <tr key={caseFile.caseIdentifier}>
      <td className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center">
        <Link
          to={`/case/${caseFile.caseIdentifier}`}
          className="comp-cell-link"
        >
          {caseFile.caseIdentifier}
        </Link>
      </td>
      <td className="comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell">
        {caseFile.caseOpenedTimestamp ? new Date(caseFile.caseOpenedTimestamp).toLocaleDateString() : "—"}
      </td>
      <td className="comp-cell-width-110">
        {caseFile.caseStatus && (
          <span className={`badge ${applyStatusClass(caseFile.caseStatus.caseStatusCode)}`}>
            {caseFile.caseStatus.shortDescription}
          </span>
        )}
      </td>
      <td>{caseFile.leadAgency?.longDescription || "—"}</td>
      <td className="comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col case-table-actions-cell">
        <Dropdown
          id={`case-action-button-${caseFile.caseIdentifier}`}
          key={`case-action-${caseFile.caseIdentifier}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`case-action-toggle-${caseFile.caseIdentifier}`}
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
            {renderDropdownAction(caseFile, "eye", "View Case", `/case/${caseFile.caseIdentifier}`)}
            {renderDropdownAction(caseFile, "pencil", "Edit Case", undefined, () =>
              console.log("Edit case", caseFile.caseIdentifier),
            )}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};
