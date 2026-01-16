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
import { LegislationText } from "@/app/components/common/legislation-text";

interface ContraventionItemProps {
  contravention: Contravention;
  investigationGuid: string;
  index: number;
  canEdit: boolean;
  onEdit: (contraventionId: string) => void;
}

export const ContraventionItem = ({
  contravention,
  investigationGuid,
  index,
  canEdit,
  onEdit,
}: ContraventionItemProps) => {
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

  const legislation = useLegislation(contravention.legislationIdentifierRef, false);
  const legislationData = legislation?.data?.legislation;

  const renderLegislation = () => {
    if (!legislationData) return "Loading...";
    const displayText = legislationData.alternateText ?? legislationData.legislationText;
    return (
      <>
        {legislationData.fullCitation} : <LegislationText>{displayText}</LegislationText>
      </>
    );
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

  return (
    <Card
      className="mb-3"
      border="default"
    >
      <Card.Header className="comp-card-header">
        <div className="comp-card-header-title">
          <h5>Contravention {index + 1}</h5>
        </div>
        <div className="comp-card-header-actions">
          <Button
            disabled={!canEdit}
            variant="outline-primary"
            size="sm"
            id="contravention-edit-button"
            onClick={() => onEdit(contravention.contraventionIdentifier)} // orchestration is done via the parent component
          >
            <i className="bi bi-pencil"></i>
            <span>Edit</span>
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            id="contravention-remove-button"
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
        {contravention.investigationParty && contravention.investigationParty.length > 0 && (
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
