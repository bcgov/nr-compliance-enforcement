export interface ChefsEventMessage {
  meta: {
    source: string;
    domain: string;
    class: string;
    type: string;
    formId: string;
    formVersionId: string;
    submissionId?: string;
    draft?: boolean;
    timestamp: string;
  };
  payload: {
    data?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
