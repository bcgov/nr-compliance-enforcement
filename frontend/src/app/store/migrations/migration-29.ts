export const AddEquipmentStatusCode = {
  29: (state: any) => {
    return {
      ...state,
      codeTables: {
        ...state.codeTables,
        "equipment-status": [],
      },
    };
  },
};
