import { Module } from "@nestjs/common";
import { PrismaModuleShared } from "../../prisma/shared/prisma.shared.module";
import { ComplexionCodeResolver } from "src/shared/complexion_code/complexion_code.resolver";
import { ComplexionCodeService } from "src/shared/complexion_code/complexion_code.service";

@Module({
  imports: [PrismaModuleShared],
  providers: [ComplexionCodeResolver, ComplexionCodeService],
})
export class ComplexionCodeModule {}
