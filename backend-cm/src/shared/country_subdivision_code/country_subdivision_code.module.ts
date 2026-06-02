import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { CountrySubdivisionCodeService } from "src/shared/country_subdivision_code/country_subdivision_code.service";
import { CountrySubdivisionCodeResolver } from "src/shared/country_subdivision_code/country_subdivision_code.resolver";

@Module({
  imports: [PrismaModuleShared],
  providers: [CountrySubdivisionCodeResolver, CountrySubdivisionCodeService],
})
export class CountrySubdivisionCodeModule {}
