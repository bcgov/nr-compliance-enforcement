export const Migration1 = {
  1: (state: any) => {

    return {
      ...state,
      outcomes: {
        assessment: {
        }
      }, // Initializing outcomes reducer to an empty object
      // Migration Details go here:   See https://github.com/bcgov/nr-compliance-enforcement/wiki/Redux-Migrations
    };
  },
};
