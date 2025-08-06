import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { applyStatusClass, formatDateTime } from "@common/methods";

type Props = {
  caseFile: any;
};

export const CaseListItem: FC<Props> = ({ caseFile }) => {
  const renderDropdownAction = (caseFile: any, icon: string, label: string, to?: string, onClick?: () => void) => {
    const itemProps = {
      id: `${label.toLowerCase().replace(" ", "-")}-case-${caseFile.caseFileGuid}`,
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
    <tr key={caseFile.caseFileGuid}>
      <td className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center">
        <Link
          to={`/case/${caseFile.caseFileGuid}`}
          className="comp-cell-link"
        >
          {caseFile.caseFileGuid}
        </Link>
      </td>
      <td className="comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell">
        {formatDateTime(caseFile.caseOpenedTimestamp)}
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
          id={`case-action-button-${caseFile.caseFileGuid}`}
          key={`case-action-${caseFile.caseFileGuid}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`case-action-toggle-${caseFile.caseFileGuid}`}
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
            {renderDropdownAction(caseFile, "eye", "View Case", `/case/${caseFile.caseFileGuid}`)}
            {renderDropdownAction(caseFile, "pencil", "Edit Case", `/case/${caseFile.caseFileGuid}/edit`)}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};
