import { InspectionParty, InvestigationParty } from "@/generated/graphql";
import React from "react";
import { Accordion, Badge, Button, ListGroup } from "react-bootstrap";

// Can we genercize this in the future?
interface Props {
  companies: InvestigationParty[] | InspectionParty[];
  people: InvestigationParty[] | InspectionParty[];
  onRemoveParty?: (partyIdentifier: string, partyName: string) => void;
}

const PartiesList: React.FC<Props> = ({ companies, people, onRemoveParty }) => {
  return (
    <>
      {people.length === 0 && companies.length === 0 && <div className="mt-3">No parties to display</div>}

      <Accordion
        className="party-accordion"
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
                      <strong>{`${party.person?.lastName}, ${party.person?.firstName} | `}</strong>
                      <span className="text-muted">{`24, Male`}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg="species-badge comp-species-badge">Witness</Badge>
                      {onRemoveParty && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() =>
                            onRemoveParty(party.partyIdentifier, `${party.person?.firstName} ${party.person?.lastName}`)
                          }
                          title="Remove party"
                        >
                          <i className="bi bi-trash" />
                        </Button>
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
                      <Badge bg="species-badge comp-species-badge">Subject of complaint</Badge>
                      {onRemoveParty && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => onRemoveParty(party.partyIdentifier, party.business?.name || "")}
                          title="Remove party"
                        >
                          <i className="bi bi-trash" />
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  );
};

export default PartiesList;
