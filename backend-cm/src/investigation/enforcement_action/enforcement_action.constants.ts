// Every enforcement action code that has its own decision-detail table, and the table it maps
// to. Unfounded/Unresolved (comment only) and Violation Ticket (the pre-existing ticket table,
// handled separately) are intentionally excluded here.
export const DECISION_DETAIL_TABLES = [
  "warning",
  "administrative_sanction",
  "enforcement_order",
  "restorative_justice",
  "court_prosecution",
  "administrative_penalty",
] as const;

export type DecisionDetailTable = (typeof DECISION_DETAIL_TABLES)[number];

const activeDetailInclude = { where: { active_ind: true } };

export const DECISION_DETAIL_INCLUDE = {
  warning: activeDetailInclude,
  administrative_sanction: activeDetailInclude,
  enforcement_order: activeDetailInclude,
  restorative_justice: activeDetailInclude,
  court_prosecution: activeDetailInclude,
  administrative_penalty: activeDetailInclude,
};
