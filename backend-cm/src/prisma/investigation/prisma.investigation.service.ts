import { Injectable } from "@nestjs/common";
//Ignoring Sonar Warning on the line below since we control the prisma client.
import { PrismaClient } from ".prisma/investigation"; // NOSONAR
import { postgisExtension } from "./extensions/postgis.extension";

// Create a type for the extended client with PostGIS methods
const extendedPrismaClient = new PrismaClient().$extends(postgisExtension);

// This class serves as the DI token and type definition
// The actual instance is provided by the factory in the module
@Injectable()
export abstract class InvestigationPrismaService {
  abstract investigation: typeof extendedPrismaClient.investigation;
  abstract investigation_status_code: typeof extendedPrismaClient.investigation_status_code;
  abstract officer_investigation_xref: typeof extendedPrismaClient.officer_investigation_xref;
  abstract $queryRaw: typeof extendedPrismaClient.$queryRaw;
  abstract $queryRawUnsafe: typeof extendedPrismaClient.$queryRawUnsafe;
  abstract $connect: typeof extendedPrismaClient.$connect;
  abstract $disconnect: typeof extendedPrismaClient.$disconnect;
  [key: string]: any;
}
