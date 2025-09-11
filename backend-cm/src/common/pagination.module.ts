import { Module } from "@nestjs/common";
import { PaginationUtility } from "./pagination.utility";

@Module({
  providers: [PaginationUtility],
  exports: [PaginationUtility],
})
export class PaginationModule {}
