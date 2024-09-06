//--
//-- The Site interface is used as part of the CEEB Outcome Authorization
//--
export interface Site {
  id?: string;
  type?: "authorized" | "unauthorized";
  site?: string;
}
