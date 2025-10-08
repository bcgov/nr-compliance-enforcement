import { InvestigationParty } from "@/generated/graphql";
import React from "react";
import { Accordion, Badge, ListGroup } from "react-bootstrap";

// Can we genercize this in the future?
interface Props {
  companies: InvestigationParty[];
  people: InvestigationParty[];
}

const RecordsList: React.FC<Props> = ({ companies, people }) => {
  return (
    <>
      {people.length === 0 && companies.length === 0 && <div className="mt-3">No records to display</div>}

      <Accordion
        className="record-accordion"
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
                    key={party.person?.investigationPersonGuid}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{`${party.person?.lastName}, ${party.person?.firstName} | `}</strong>
                      <span className="text-muted">{`24, Male`}</span>
                    </div>
                    <Badge bg="species-badge comp-species-badge">Witness</Badge>
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
                    key={party.business?.investigationBusinessGuid}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{party.business?.name}</strong>
                    </div>
                    <Badge bg="species-badge comp-species-badge">Subject of complaint</Badge>
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

export default RecordsList;
