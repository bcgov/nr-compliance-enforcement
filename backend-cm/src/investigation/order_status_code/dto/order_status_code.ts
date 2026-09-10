import { createMap, forMember, mapFrom, Mapper } from "@automapper/core";
import { order_status_code } from "../../../../prisma/investigation/generated/order_status_code";

export class OrderStatusCode {
  orderStatusCode: string;
  shortDescription: string;
  longDescription: string;
  displayOrder: number;
  activeIndicator: boolean;
}

export const mapPrismaOrderStatusCodeToOrderStatusCode = (mapper: Mapper) => {
  createMap<order_status_code, OrderStatusCode>(
    mapper,
    "order_status_code",
    "OrderStatusCode",
    forMember(
      (dest) => dest.orderStatusCode,
      mapFrom((src) => src.order_status_code),
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
