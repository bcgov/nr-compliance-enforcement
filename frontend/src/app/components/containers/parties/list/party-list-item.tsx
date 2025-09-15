import { useAppSelector } from "@/app/hooks/hooks";
import { selectPartyTypeDropdown } from "@/app/store/reducers/code-table-selectors";
import { FC } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

type Props = {
  party: any;
};

export const PartyListItem: FC<Props> = ({ party }) => {
  const partyTypes = useAppSelector(selectPartyTypeDropdown);

  const renderDropdownAction = (party: any, icon: string, label: string, to?: string, onClick?: () => void) => {
    const itemProps = {
      id: `${label.toLowerCase().replace(" ", "-")}-party-${party.partyIdentifier}`,
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

  const displayName = () => {
    let result = "";
    if (party?.person) result = `${party.person?.lastName}, ${party.person?.firstName}`;
    else if (party?.business) {
      result = `${party.business?.name}`;
    }
    return result;
  };

  return (
    <tr key={party.partyIdentifier}>
      <td className="comp-cell-width-110 comp-cell-min-width-110 sticky-col sticky-col--left text-center">
        <Link
          to={`/party/${party.partyIdentifier}`}
          className="comp-cell-link"
        >
          {party.partyIdentifier}
        </Link>
      </td>

      <td className="comp-cell-width-110">{partyTypes.find((item) => item.value === party.partyTypeCode)?.label}</td>

      <td className="comp-cell-width-110">{party.person?.firstName}</td>
      <td className="comp-cell-width-110">{party.person?.lastName}</td>
      <td className="comp-cell-width-110">{party.business?.name}</td>
      <td className="comp-cell-width-90 comp-cell-min-width-90 sticky-col sticky-col--right actions-col">
        <Dropdown
          id={`party-action-button-${party.partyIdentifier}`}
          key={`party-action-${party.partyIdentifier}`}
          drop="start"
          className="comp-action-dropdown"
        >
          <Dropdown.Toggle
            id={`party-action-toggle-${party.partyIdentifier}`}
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
            {renderDropdownAction(party, "eye", "View Party", `/party/${party.partyIdentifier}`)}
            {renderDropdownAction(party, "pencil", "Edit Party", `/party/${party.partyIdentifier}/edit`)}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};
