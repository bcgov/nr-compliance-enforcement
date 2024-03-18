export const Migration2 = {
    2: (state: any) => {
  
      return {
        ...state,
        cases: {
          assessment: {
          }
        }, // Initializing outcomes reducer to an empty object
        // Migration Details go here:   See https://github.com/bcgov/nr-compliance-enforcement/wiki/Redux-Migrations
      };
    },
  };
  