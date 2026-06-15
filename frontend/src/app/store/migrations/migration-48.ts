// Adds new code tables for expanded person profiles
export const PersonProfileUpdates = {
  48: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "approximate-age-type": [],
        "gender-type": [],
        "complexion-type": [],
        "build-type": [],
        "hair-colour-type": [],
        "hair-length-type": [],
        "eye-colour-type": [],
        "facial-hair-style-type": [],
      },
    };
  },
};
