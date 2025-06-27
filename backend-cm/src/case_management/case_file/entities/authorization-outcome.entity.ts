export interface AuthorizationOutcome {
  id: string;
  type: "permit" | "site";
  value: string;
}
