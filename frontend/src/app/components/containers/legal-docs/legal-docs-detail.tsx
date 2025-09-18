import { FC, useMemo } from "react";
import { useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLQuery } from "@graphql/hooks";

const GET_DOC_WITH_NODES = gql`
  query GetLegalDocumentWithNodes($id: ID!) {
    legalDocumentWithNodes(legalDocumentGuid: $id) {
      legalDocument {
        legalDocumentGuid
        title
        documentType
        xmlContent
        chapter
        yearEnacted
        assentedTo
      }
      nodes {
        legalDocumentNodeGuid
        parentNodeGuid
        elementName
        elementId
        elementNumber
        elementText
        sortOrder
      }
    }
  }
`;

// Legacy recursive component removed (using single query now)

export const LegalDocumentsDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGraphQLQuery<{ legalDocumentWithNodes: { legalDocument: any; nodes: any[] } }>(
    GET_DOC_WITH_NODES,
    {
      queryKey: ["legalDocumentWithNodes", id],
      variables: { id },
      enabled: !!id,
    },
  );

  const doc = data?.legalDocumentWithNodes?.legalDocument;
  const nodes = useMemo(() => data?.legalDocumentWithNodes?.nodes ?? [], [data]);

  if (isLoading) return <div className="container p-3">Loading document...</div>;
  if (error) return <div className="container p-3 text-danger">Failed to load document.</div>;
  if (!doc) return <div className="container p-3">Not found.</div>;

  const renderNode = (node: any): JSX.Element => {
    const children = nodes.filter((c) => c.parentNodeGuid === node.legalDocumentNodeGuid);
    return (
      <li key={node.legalDocumentNodeGuid}>
        <div>
          <strong>{node.elementNumber ? `${node.elementNumber} ` : ""}</strong>
          <span>{node.elementText}</span>
        </div>
        {children.length > 0 && <ul>{children.map((child) => renderNode(child))}</ul>}
      </li>
    );
  };

  return (
    <div className="container p-3">
      <h2 className="mb-3">{doc.title || doc.legalDocumentGuid}</h2>
      <div className="mb-3 text-muted">{doc.documentType}</div>
      {nodes.length === 0 ? (
        <div>No parsed nodes. Raw XML available.</div>
      ) : (
        <ul>{nodes.filter((n) => !n.parentNodeGuid).map((n) => renderNode(n))}</ul>
      )}
    </div>
  );
};

export default LegalDocumentsDetail;
