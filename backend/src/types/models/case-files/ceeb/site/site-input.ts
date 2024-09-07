export interface SiteInput {
  id?: string;
  type: "authorized" | "unauthorized";
  site: string;
}
