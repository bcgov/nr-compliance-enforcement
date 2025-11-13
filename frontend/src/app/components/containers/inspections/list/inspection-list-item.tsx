import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { applyStatusClass, formatDateTime } from "@common/methods";
import { Inspection } from "@/generated/graphql";
import { selectAgencyDropdown } from "@/app/store/reducers/code-table";
import { useAppSelector } from "@/app/hooks/hooks";
import Option from "@apptypes/app/option";

type Props = {
  data: Inspection;
  cases: any[];
};

export const InspectionListItem: FC<Props> = ({ data, cases }) => {
  const leadAgencyOptions = useAppSelector(selectAgencyDropdown);
  const leadAgency = leadAgencyOptions.find((option: Option) => option.value === data?.leadAgency);
  const leadAgencyText = leadAgency ? leadAgency.label : "-";

  const renderDropdownAction = (data: Inspection, icon: string, label: string, to?: string, onClick?: () => void) => {
    const itemProps = {
      id: `${label.toLowerCase().replace(" ", "-")}-inspection-${data.inspectionGuid}`,
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
    <tr key={data.inspectionGuid}>
      <td className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center">
        <Link
          to={`/inspection/${data.inspectionGuid}`}
          className="comp-cell-link"
        >
          {data.name || data.inspectionGuid}
        </Link>
      </td>
      <td className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center">
        {cases.map((caseFile) => (
          <Link
            to={`/case/${caseFile.caseIdentifier}`}
            className="comp-cell-link"
            key={caseFile.caseIdentifier}
          >
            {caseFile.name || caseFile.caseIdentifier}
          </Link>
        ))}
      </td>
      <td className="comp-cell-width-160 comp-cell-min-width-160 case-table-date-cell">
        {formatDateTime(data.openedTimestamp)}
      </td>
      <td className="comp-cell-width-110">
        {data.inspectionStatus?.inspectionStatusCode && (
          <span className={`badge ${applyStatusClass(data.inspectionStatus.inspectionStatusCode)}`}>
            {data.inspectionStatus.shortDescription}
          </span>
        )}
      </td>
      <td>{leadAgencyText}</td>
      <td className="comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col case-table-actions-cell">
        <Dropdown
          id={`inspection-action-button-${data.inspectionGuid}`}
          key={`inspection-action-${data.inspectionGuid}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`inspection-action-toggle-${data.inspectionGuid}`}
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
            {renderDropdownAction(data, "eye", "View inspection", `/inspection/${data.inspectionGuid}`)}
            {renderDropdownAction(data, "pencil", "Edit inspection", `/inspection/${data.inspectionGuid}/edit`)}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};
