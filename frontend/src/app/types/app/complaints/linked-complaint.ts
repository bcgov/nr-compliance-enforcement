export interface LinkedComplaint {
  id: string;
  details: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  issueType?: string;
  parent: boolean;
  link_type?: string;
  agency?: string;
  type?: string;
}
