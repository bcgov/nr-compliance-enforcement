import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { useLegislation } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { useAppDispatch } from "@/app/hooks/hooks";
import { openModal } from "@/app/store/reducers/app";
import { DELETE_CONFIRM } from "@/app/types/modal/modal-types";
import { Contravention, InvestigationParty } from "@/generated/graphql";
import { gql } from "graphql-request";
import { useCallback } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

interface ContraventionItemProps {
  contravention: Contravention;
  investigationGuid: string;
  index: number;
}

export const ContraventionItem = ({ contravention, investigationGuid, index }: ContraventionItemProps) => {
  const REMOVE_CONTRAVENTION = gql`
    mutation RemoveContravention($investigationGuid: String!, $contraventionGuid: String!) {
      removeContravention(investigationGuid: $investigationGuid, contraventionGuid: $contraventionGuid) {
        investigationGuid
      }
    }
  `;

  const removeContraventionMutation = useGraphQLMutation(REMOVE_CONTRAVENTION, {
    onSuccess: () => {
      ToggleSuccess("Contravention removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing contravention:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove contravention");
    },
  });

  const legislation = useLegislation(contravention.legislationIdentifierRef);
  const legislationData = legislation?.data?.legislation;

  const renderLegislation = () => {
    if (!legislationData) return "Loading...";
    const displayText = legislationData.alternateText ?? legislationData.legislationText;
    return `${legislationData.fullCitation} : ${displayText}`;
  };

  const renderParty = (party: InvestigationParty) => {
    if (party.business) {
      return party.business.name;
    } else if (party.person) {
      return `${party.person.lastName}, ${party.person.firstName}`;
    } else {
      return "Unknown Party";
    }
  };
  const dispatch = useAppDispatch();

  const handleRemoveContravention = useCallback(
    (contraventionGuid: string) => {
      dispatch(
        openModal({
          modalSize: "md",
          modalType: DELETE_CONFIRM,
          data: {
            title: "Remove Contravention",
            description: `Are you sure you want to remove this contravention from this investigation? This action cannot be undone.`,
            deleteConfirmed: () => {},
          },
          callback: () => {
            removeContraventionMutation.mutate({
              investigationGuid: investigationGuid,
              contraventionGuid: contraventionGuid,
            });
          },
        }),
      );
    },
    [dispatch, investigationGuid, removeContraventionMutation],
  );

  console.log(contravention);

  return (
    <Card
      className="mb-3"
      border="default"
    >
      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h4>Contravention {index + 1} (Alleged)</h4>
        </div>
        <div className="comp-card-header-actions">
          <Button
            variant="outline-primary"
            size="sm"
            id="details-screen-edit-button"
            onClick={() => handleRemoveContravention(contravention?.contraventionIdentifier)}
          >
            <i className="bi bi-trash"></i>
            <span>Delete</span>
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="comp-contravention">
        <Row
          as="dl"
          className="mb-3"
        >
          <Col xs={12}>
            <dd>{renderLegislation()}</dd>
          </Col>
        </Row>
        {(contravention?.investigationParty ?? []).length > 0 && (
          <Row
            as="dl"
            className="mb-3"
          >
            <Col
              xs={12}
              lg={2}
            >
              <dt>Parties</dt>
            </Col>
            <Col
              xs={12}
              lg={10}
            >
              {contravention?.investigationParty?.map((party) => (
                <dd key={party?.partyIdentifier}>{renderParty(party as InvestigationParty)}</dd>
              ))}
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};
