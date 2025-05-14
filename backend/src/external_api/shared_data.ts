import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const caseManagementlURL = process.env.CASE_MANAGEMENT_API_URL;

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error(error.response);
  return Promise.reject(error as Error);
});

export const caseFileQueryFields: string = `
{
  caseIdentifier
  leadIdentifier
  assessment {
    id
    agencyCode
    actionNotRequired
    actionJustificationCode
    actionJustificationShortDescription
    actionJustificationLongDescription
    actionJustificationActiveIndicator
    actions {
      actionId
      actor
      date
      actionCode
      shortDescription
      longDescription
      activeIndicator
      isLegacy
    }
    contactedComplainant
    attended
    locationType {
      key
      value
    }
    conflictHistory {
      key
      value
    }
    categoryLevel {
      key
      value
    }
    cat1Actions {
      actionId
      actor
      date
      actionCode
      shortDescription
      longDescription
      activeIndicator
    }
  }
  isReviewRequired
  reviewComplete {
    actor
    date
    actionCode
    actionId
    activeIndicator
  }
  prevention {
    id
    agencyCode
    actions {
      actionId
      actor
      date
      actionCode
      shortDescription
      longDescription
      activeIndicator
    }
  }
  notes {
    id
    note 
    actions { 
      actor
      actionCode
      date,
      actionId,
      activeIndicator
    }
  }
  equipment {
    id
    typeCode
    typeDescription
    activeIndicator
    address
    xCoordinate
    yCoordinate
    createDate
    actions { 
      actionId
      actor
      actionCode
      date
    }
    wasAnimalCaptured
    quantity
  },
  subject { 
    id
    species
    sex
    sexDescription
    age
    ageDescription
    categoryLevel
    categoryLevelDescription
    identifyingFeatures
    outcome
    outcomeDescription
    outcomeActionedBy
    outcomeActionedByDescription
    tags { 
      id
      ear
      earDescription
      identifier
      order
    }
    drugs { 
      id
      vial
      drug
      drugDescription
      amountUsed
      injectionMethod
      injectionMethodDescription
      remainingUse
      remainingUseDescription
      additionalComments
      order
    }
    actions { 
      actionId
      actor
      actionCode
      date
    }
    order
  }
  decision { 
    id
    schedule
    scheduleLongDescription
    sector
    sectorLongDescription
    discharge
    dischargeLongDescription
    ipmAuthCategory
    ipmAuthCategoryLongDescription
    nonCompliance
    nonComplianceLongDescription
    rationale
    inspectionNumber
    leadAgency
    leadAgencyLongDescription
    assignedTo
    actionTaken
    actionTakenLongDescription
    actionTakenDate
  }
  authorization { 
    id
    type
    value
  }
}
`;

export const get = (token, params?: {}) => {
  let config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (params) {
    config.params = params;
  }
  return axios
    .get(caseManagementlURL, config)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return data;
    })
    .catch((error: AxiosError) => {
      if (error.response) {
        const data = error.response?.data as any;
        throw new Error(`Shared Data Request Failed: ${JSON.stringify(data?.errors)}`);
      } else if (error.request) {
        throw new Error(`No response received from the Shared Data server: ${caseManagementlURL}`);
      } else {
        throw new Error(`Request setup error to Shared Data: ${error.message}`);
      }
    });
};

export const post = (token, payload?: {}) => {
  let config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axios
    .post(caseManagementlURL, payload, config)
    .then((response: AxiosResponse) => {
      return { response: response, error: null as AxiosError };
    })
    .catch((error: AxiosError) => {
      return { response: null as AxiosResponse, error: error };
    });
};
