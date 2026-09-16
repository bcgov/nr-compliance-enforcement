import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { order_type_code } from "../../../../prisma/investigation/generated/order_type_code";

export class OrderTypeCode {
  orderTypeCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaOrderTypeCodeToOrderTypeCode = (mapper: Mapper) => {
  createMap<order_type_code, OrderTypeCode>(
    mapper,
    "order_type_code",
    "OrderTypeCode",
    forMember(
      (dest) => dest.orderTypeCode,
      mapFrom((src) => src.order_type_code),
    ),
    forMember(
      (dest) => dest.shortDescription,
      mapFrom((src) => src.short_description),
    ),
    forMember(
      (dest) => dest.longDescription,
      mapFrom((src) => src.long_description),
    ),
    forMember(
      (dest) => dest.displayOrder,
      mapFrom((src) => src.display_order),
    ),
    forMember(
      (dest) => dest.activeIndicator,
      mapFrom((src) => src.active_ind),
    ),
  );
};
