// Refresh the profile for coms access indicator
export const UpdateMapLogicForClustering = {
  25: (state: any) => {
    return {
      ...state,
      complaints: {
        ...state.complaints,
        mappedComplaintsCount: { mapped: 0, unmapped: 0 },
      },
    };
  },
};
