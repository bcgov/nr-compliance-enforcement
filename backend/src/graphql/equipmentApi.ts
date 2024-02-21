import { get } from "./graphqlApi";

export const EquipmentApi = {
  getAllEquipmentCodes : async () => {
    const { data } = await get({ 
      query : `{
        getAllActiveEquipmentCodes {
          equipment_code short_description long_description display_order
        }
      }` 
    })
    return data.getAllActiveEquipmentCodes
  }
}

