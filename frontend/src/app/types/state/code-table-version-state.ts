interface CodeTableVersionType {
  configurationCode: string;
  configurationValue: string;
  activeInd: boolean;
}

export interface CodeTableVersionState {
  complaintManagement: CodeTableVersionType;
  caseManagement: CodeTableVersionType;
}
