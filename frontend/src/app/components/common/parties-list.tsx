import { useAppSelector } from "@/app/hooks/hooks";
import { InspectionParty, InvestigationParty } from "@/generated/graphql";
import React from "react";
import { Accordion, Badge, Dropdown, ListGroup } from "react-bootstrap";
import { selectCodeTable } from "@store/reducers/code-table";
import { CODE_TABLE_TYPES } from "@/app/constants/code-table-types";
import { CaseActivities } from "@/app/constants/case-activities";

// Can we genercize this in the future?
interface Props {
  companies: InvestigationParty[] | InspectionParty[];
  people: InvestigationParty[] | InspectionParty[];
  onRemoveParty?: (partyIdentifier: string, partyName: string) => void;
  onEditParty?: (party: InvestigationParty | InspectionParty) => void;
  activityType: string;
}

const PartiesList: React.FC<Props> = ({ companies, people, onRemoveParty, onEditParty, activityType }) => {
  const partyRoles = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.PARTY_ASSOCIATION_ROLE));
  const genderCodes = useAppSelector(selectCodeTable(CODE_TABLE_TYPES.GENDER));

  const getPersonDetails = (party: InvestigationParty | InspectionParty) => {
    // Only investigations are currently supported
    if (activityType !== CaseActivities.INVESTIGATION) {
      return "";
    }

    const investigationParty = party as InvestigationParty;
    const parts: string[] = [];

    if (investigationParty.person?.dateOfBirth) {
      const dateStr = String(investigationParty.person.dateOfBirth).slice(0, 10);
      const [year, month, day] = dateStr.split("-").map(Number);
      const today = new Date();
      let age = today.getFullYear() - year;
      if (today.getMonth() + 1 < month || (today.getMonth() + 1 === month && today.getDate() < day)) {
        age--;
      }
      parts.push(String(age));
    }

    if (investigationParty.person?.genderCode) {
      const genderDescription = genderCodes?.find(
        (code: any) => code.sex === investigationParty.person?.genderCode,
      )?.shortDescription;
      if (genderDescription) {
        parts.push(genderDescription);
      }
    }
    return parts.join(", ");
  };

  const getPartyRoleText = (selected: InvestigationParty | InspectionParty) => {
    let currentActivityType = "";
    if (activityType === CaseActivities.INSPECTION) {
      currentActivityType = "INSPECTION";
    }
    if (activityType === CaseActivities.INVESTIGATION) {
      currentActivityType = "INVSTGTN";
    }
    const partyRoleText: string = partyRoles.find(
      (partyRole) =>
        partyRole.partyAssociationRole === selected.partyAssociationRole &&
        partyRole.caseActivityTypeCode === currentActivityType,
    )?.shortDescription;
    return partyRoleText;
  };

  return (
    <Accordion
      className="party-accordion mb-3"
      defaultActiveKey={["0", "1"]}
      alwaysOpen
    >
      {people.length > 0 && (
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <i className="bi bi-people me-1" /> People ({people.length})
          </Accordion.Header>
          <Accordion.Body className="p-0">
            <ListGroup variant="flush">
              {people.map((party) => (
                <ListGroup.Item
                  key={party.person?.personGuid}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{`${party.person?.lastName}, ${party.person?.firstName}`}</strong>
                    {getPersonDetails(party) && <span className="text-muted">{` | ${getPersonDetails(party)}`}</span>}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="species-badge comp-species-badge">{getPartyRoleText(party)}</Badge>
                    {(onRemoveParty || onEditParty) && (
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="link"
                          className="p-0"
                          bsPrefix="dropdown-toggle-no-caret"
                        >
                          <i className="bi bi-three-dots-vertical" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {onRemoveParty && (
                            <Dropdown.Item
                              onClick={() =>
                                onRemoveParty(
                                  party.partyIdentifier,
                                  `${party.person?.firstName} ${party.person?.lastName}`,
                                )
                              }
                            >
                              <i className="bi bi-trash me-2" />
                              {/* */}Remove
                            </Dropdown.Item>
                          )}
                          {onEditParty && (
                            <Dropdown.Item onClick={() => onEditParty(party)}>
                              <i className="bi bi-pencil me-2" />
                              {/* */}Edit
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      )}

      {companies.length > 0 && (
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <i className="bi bi-building me-1" /> Companies ({companies.length})
          </Accordion.Header>
          <Accordion.Body className="p-0">
            <ListGroup variant="flush">
              {companies.map((party) => (
                <ListGroup.Item
                  key={party.business?.businessGuid}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{party.business?.name}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="species-badge comp-species-badge">{getPartyRoleText(party)}</Badge>
                    {(onRemoveParty || onEditParty) && (
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="link"
                          className="p-0"
                          bsPrefix="dropdown-toggle-no-caret"
                        >
                          <i className="bi bi-three-dots-vertical" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {onRemoveParty && (
                            <Dropdown.Item
                              onClick={() => onRemoveParty(party.partyIdentifier, party.business?.name || "")}
                            >
                              <i className="bi bi-trash me-2" />
                              {/* */}Remove
                            </Dropdown.Item>
                          )}
                          {onEditParty && (
                            <Dropdown.Item onClick={() => onEditParty(party)}>
                              <i className="bi bi-pencil me-2" />
                              {/* */}Edit
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
  );
};

export default PartiesList;
