import { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";

const LIST_LEGAL_DOCUMENTS = gql`
  query ListLegalDocuments($documentType: String) {
    legalDocuments(documentType: $documentType) {
      legalDocumentGuid
      documentType
      title
      externalIdentifier
      chapter
      yearEnacted
      assentedTo
    }
  }
`;

export const LegalDocuments: FC = () => {
  const { data, isLoading, error } = useGraphQLQuery<{ legalDocuments: any[] }>(LIST_LEGAL_DOCUMENTS, {
    queryKey: ["legalDocuments"],
    variables: {},
  });

  const documents = useMemo(() => data?.legalDocuments ?? [], [data]);

  if (isLoading) return <div className="container p-3">Loading legal documents...</div>;
  if (error) return <div className="container p-3 text-danger">Failed to load legal documents.</div>;

  return (
    <div className="container p-3">
      <h2 className="mb-3">Legal documents</h2>
      {documents.length === 0 ? (
        <div>No documents available.</div>
      ) : (
        <ul className="list-group">
          {documents.map((doc) => (
            <li
              key={doc.legalDocumentGuid}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div className="fw-bold">{doc.title || doc.externalIdentifier || doc.legalDocumentGuid}</div>
                <small className="text-muted">{doc.documentType}</small>
              </div>
              <Link
                className="btn btn-outline-primary btn-sm"
                to={`/legal-docs/${doc.legalDocumentGuid}`}
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LegalDocuments;
