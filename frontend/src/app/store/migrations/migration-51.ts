// Party type CMP was renamed to ORG, so cached party types no longer match the codes the UI filters on.
export const RenamePartyTypeToOrganization = {
  51: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "party-type": [],
      },
    };
  },
};
