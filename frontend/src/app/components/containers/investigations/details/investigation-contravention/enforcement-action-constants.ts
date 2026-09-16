export const NON_EA_DECISION_CODES = new Set(["UNFD", "UNRS"]); // Unfounded, Unresolved

export const CODE_WARNING = "WARN";
export const CODE_VIOLATION_TICKET = "FDVT";
export const CODE_ADMINISTRATIVE_SANCTION = "ADSN";
export const CODE_ORDER = "ORDR";
export const CODE_RESTORATIVE_JUSTICE = "RJUS";
export const CODE_COURT_PROSECUTION = "CTPR";
export const CODE_ADMINISTRATIVE_PENALTY = "ADPN";

// Decisions that record a "Comments" field
export const COMMENT_DECISION_CODES = new Set([
  CODE_ADMINISTRATIVE_SANCTION,
  CODE_RESTORATIVE_JUSTICE,
  CODE_ADMINISTRATIVE_PENALTY,
]);
