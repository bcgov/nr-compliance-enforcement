import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";

const caseManagementlURL = process.env.CASE_MANAGEMENT_API_URL;

axios.interceptors.response.use(undefined, (error: AxiosError) => {
  console.error(error.response);
  return Promise.reject(error);
});

export const caseFileQueryFields: string = `
{
  caseIdentifier
  leadIdentifier
  assessmentDetails {
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
  preventionDetails {
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
  note {
    note 
    action { 
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
  },
  subject { 
    id
    species
    sex
    age
    categoryLevel
    identifyingFeatures
    outcome
    tags { 
      id
      ear
      identifier

      order
    }
    drugs { 
      id

      vial
      drug
      amountUsed
      injectionMethod
    
      remainingUse
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
        throw new Error(`Case Management Request Failed: ${error.response.data}`);
      } else if (error.request) {
        throw new Error(`No response received from the Case Management server: ${caseManagementlURL}`);
      } else {
        throw new Error(`Request setup error to Case Management: ${error.message}`);
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
