import { get } from "./graphqlApi";

export const EquipmentApi = {
  getAllEquipmentCodes : async (token) => {
    const {data} = await get(token, { 
      query : "{getAllEquipmentCodes{equipment_code short_description long_description display_order active_ind}}"
    })
    return data.getAllEquipmentCodes
  }
}

