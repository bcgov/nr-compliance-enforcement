import { gql } from "graphql-request";

export const CREATE_ENFORCEMENT_ACTION = gql`
  mutation CreateEnforcementAction($input: CreateEnforcementActionInput!) {
    createEnforcementAction(input: $input) {
      enforcementActionIdentifier
      enforcementActionCode {
        enforcementActionCode
        shortDescription
      }
      dateIssued
      geoOrganizationUnitCode
      appUserIdentifier
      activeIndicator
      ticket {
        ticketIdentifier
        ticketOutcomeCode
        ticketAmount
        ticketNumber
        paidDate
      }
    }
  }
`;

export const UPDATE_ENFORCEMENT_ACTION = gql`
  mutation UpdateEnforcementAction($input: UpdateEnforcementActionInput!) {
    updateEnforcementAction(input: $input) {
      enforcementActionIdentifier
      enforcementActionCode {
        enforcementActionCode
        shortDescription
      }
      dateIssued
      geoOrganizationUnitCode
      appUserIdentifier
      activeIndicator
      ticket {
        ticketIdentifier
        ticketOutcomeCode
        ticketAmount
        ticketNumber
        paidDate
      }
    }
  }
`;

export const REMOVE_ENFORCEMENT_ACTION = gql`
  mutation RemoveEnforcementAction($enforcementActionId: String!) {
    removeEnforcementAction(enforcementActionId: $enforcementActionId) {
      enforcementActionIdentifier
    }
  }
`;
