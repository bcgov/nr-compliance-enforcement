//--
//-- The Site interface is used as part of the CEEB Outcome Authorization
//--
export interface PermitSite {
  id?: string;
  type?: "permit" | "site";
  value?: string;
}
