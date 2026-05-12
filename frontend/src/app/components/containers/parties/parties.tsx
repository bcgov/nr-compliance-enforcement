import { FC, useCallback } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { PartyResult } from "@/generated/graphql";
import { PartyList } from "./list/party-list";
import { PartyFilterBar } from "./list/party-filter-bar";
import { usePartySearch } from "./hooks/use-party-search";
import { PartyListTabs } from "@/app/components/containers/parties/list/party-list-tabs";

const SEARCH_PARTIES = gql`
  query SearchParties($page: Int, $pageSize: Int, $filters: PartyFilters) {
    searchParties(page: $page, pageSize: $pageSize, filters: $filters) {
      items {
        __typename
        partyIdentifier
        partyTypeCode
        shortDescription
        longDescription
        createdDateTime
        person {
          personGuid
          firstName
          lastName
          dateOfBirth
          contactMethods {
            typeCode
            value
            isPrimary
          }
        }
        business {
          businessGuid
          name
          identifiers {
            identifierValue
            identifierCode {
              businessIdentifierCode
            }
          }
          contactMethods {
            typeCode
            value
            isPrimary
          }
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalPages
        totalCount
      }
    }
  }
`;

const Parties: FC = () => {
  const navigate = useNavigate();

  const { searchValues, setValues, getFilters } = usePartySearch();

  const { data, isLoading, error } = useGraphQLQuery<{ searchParties: PartyResult }>(SEARCH_PARTIES, {
    queryKey: [
      "searchParties",
      searchValues.search,
      searchValues.partyTypeCode,
      searchValues.sortBy,
      searchValues.sortOrder,
      searchValues.page,
      searchValues.pageSize,
    ],
    variables: {
      page: searchValues.page,
      pageSize: searchValues.pageSize,
      filters: getFilters(),
    },
    placeholderData: (previousData) => previousData,
  });

  const handleCreateClick = () => {
    navigate("/party/create");
  };

  const handleTabChange = useCallback(
    (partyTypeCode: string) => {
      setValues({ partyTypeCode });
    },
    [setValues],
  );

  const parties = data?.searchParties?.items ?? [];
  const totalParties = data?.searchParties?.pageInfo?.totalCount ?? 0;

  return (
    <div className="comp-page-container comp-page-container--noscroll">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Parties</h1>
          <Button
            onClick={handleCreateClick}
            variant="primary"
          >
            <i className="bi bi-plus-circle" />
            <span>Create party</span>
          </Button>
        </div>

        <PartyListTabs
          partyTypeCode={searchValues.partyTypeCode}
          onTabChange={handleTabChange}
        />

        <PartyFilterBar />
      </div>

      <div className="comp-data-container">
        <div className="comp-data-list-map">
          <PartyList
            parties={parties}
            partyTypeCode={searchValues.partyTypeCode}
            totalItems={totalParties}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Parties;
