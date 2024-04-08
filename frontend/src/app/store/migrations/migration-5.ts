//Add personGuid in app and isReviewRequired,reviewComplete in cases
export const AddPersonGuidAndOutcomeReview = {
  5: (state: any) => {
    return {
      ...state,
      app: {
        profile: {
          personGuid: ""
        },
      },
      cases: {
        isReviewRequired: false,
        reviewComplete: null
      },
    };
  },
};
