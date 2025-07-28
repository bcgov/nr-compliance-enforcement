import { FC } from "react";
import { Link } from "react-router-dom";
import { useGraphQLQuery } from "@graphql/hooks";
import { gql } from "graphql-request";
import { CaseMomsSpaghettiFileResult } from "@/generated/graphql";

const GET_CASE_FILES = gql`
  query GetCaseMomsSpaghettiFiles($page: Int, $pageSize: Int) {
    caseMomsSpaghettiFiles(page: $page, pageSize: $pageSize) {
      items {
        __typename
        caseIdentifier
        caseOpenedTimestamp
        caseStatus {
          caseStatusCode
          shortDescription
          longDescription
        }
        leadAgency {
          agencyCode
          shortDescription
          longDescription
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

const Cases: FC = () => {
  const { data, isLoading, error } = useGraphQLQuery<{ caseMomsSpaghettiFiles: CaseMomsSpaghettiFileResult }>(
    GET_CASE_FILES,
    {
      queryKey: ["caseMomsSpaghettiFiles"],
      variables: { page: 1, pageSize: 50 },
    },
  );

  if (isLoading) {
    return (
      <div className="comp-page-container">
        <div className="comp-container">
          <div className="comp-page-header">
            <div className="comp-page-title-container">
              <h1>Cases</h1>
            </div>
          </div>
          <div className="comp-page-content">
            <p>Loading cases...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="comp-page-container">
        <div className="comp-container">
          <div className="comp-page-header">
            <div className="comp-page-title-container">
              <h1>Cases</h1>
            </div>
          </div>
          <div className="comp-page-content">
            <p>Error loading cases: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const cases = data?.caseMomsSpaghettiFiles?.items || [];

  return (
    <div className="comp-page-container">
      <div className="comp-container">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Cases</h1>
          </div>
        </div>
        <div className="comp-page-content">
          {cases.length === 0 ? (
            <p>No cases found.</p>
          ) : (
            <div className="mt-3">
              <ul>
                {cases.map((caseFile) => (
                  <li key={caseFile.caseIdentifier}>
                    <Link to={`/case/${caseFile.caseIdentifier}`}>
                      Case #{caseFile.caseIdentifier}
                      {caseFile.caseStatus && (
                        <span className="ms-2 badge bg-secondary">{caseFile.caseStatus.shortDescription}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cases;
