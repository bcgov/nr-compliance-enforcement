export const AgencyType = {
  COS: "COS",
  CEEB: "EPO",
  NROS: "NROS",
  MINES: "MINES",
  PARKS: "PARKS",
  SECTOR: "NRS",
  FCBC: "FCBC",
  WEB: "WEB",
  BCCEA: "BCCEA",
  ECCC: "ECCC",
  DFO: "DFO",
  POL: "POL",
  OTH: "OTH",
};

export const AgencyNames = {
  COS: { short: "COS", long: "Conservation Officer Service" },
  EPO: { short: "CEEB", long: "Compliance and Environmental Enforcement Branch" },
  PARKS: { short: "BC Parks", long: "BC Parks" },
  NRS: { short: "Natural Resource Sector", long: "Natural Resource Sector" },
  NROS: { short: "NROS", long: "Natural Resource Officer Service" },
  MINES: { short: "Mines", long: "Mines Health, Safety & Enforcement" },
};

export const AgencyTabLabels: Record<string, string> = {
  [AgencyType.ECCC]: "ECCC",
  [AgencyType.DFO]: "DFO",
  [AgencyType.FCBC]: "FCBC",
  [AgencyType.WEB]: "WEB",
};
