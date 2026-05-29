import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { CountryCodeResolver } from "src/shared/country_code/country_code.resolver";
import { CountryCodeService } from "src/shared/country_code/country_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [CountryCodeResolver, CountryCodeService],
})
export class CountryCodeModule {}
