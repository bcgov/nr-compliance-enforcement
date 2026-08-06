import { Injectable, Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { toDate, toDateString } from "src/common/custom_scalars";
import { UserService } from "src/common/user.service";
import { CreateUpdateContraventionInput } from "src/investigation/contravention/dto/contravention";
import { Investigation } from "src/investigation/investigation/dto/investigation";
import { InvestigationService } from "src/investigation/investigation/investigation.service";
import { InvestigationPrismaService } from "src/prisma/investigation/prisma.investigation.service";
import { SharedPrismaService } from "src/prisma/shared/prisma.shared.service";
import { withRlsTransaction } from "../../pg-session-extension/with-rls-transaction";

const getCurrentDatePacific = (): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Vancouver" }).format(new Date());

@Injectable()
export class ContraventionService {
  constructor(
    private readonly prisma: InvestigationPrismaService,
    private readonly sharedPrisma: SharedPrismaService,
    private readonly user: UserService,
    private readonly investigationService: InvestigationService,
  ) {}

  private readonly logger = new Logger(ContraventionService.name);

  async create(contraventionInput: CreateUpdateContraventionInput): Promise<Investigation> {
    const contraventionDate = toDateString(contraventionInput.date);
    this.validateContraventionDate(contraventionDate);
    await this.validateLegislationReference(contraventionInput.legislationReference, contraventionDate);

    try {
      await withRlsTransaction(this.prisma, async (db) => {
        const contravention = await db.contravention.create({
          data: {
            investigation_guid: contraventionInput.investigationGuid,
            legislation_guid_ref: contraventionInput.legislationReference,
            contravention_date: contraventionInput.date,
            geo_organization_unit_code_ref: contraventionInput.community,
            active_ind: true,
            create_user_id: this.user.getIdirUsername(),
            create_utc_timestamp: new Date(),
          },
        });

        const parties = contraventionInput.investigationPartyGuids;

        for (const party of parties) {
          await db.contravention_party_xref.create({
            data: {
              contravention_guid: contravention.contravention_guid,
              investigation_party_guid: party,
              create_user_id: this.user.getIdirUsername(),
              create_utc_timestamp: new Date(),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error("Error adding contravention:", error);
      throw error;
    }
    await this.investigationService.updateInvestigationTimestamp(contraventionInput.investigationGuid);

    return await this.investigationService.findOne(contraventionInput.investigationGuid);
  }

  async remove(investigationGuid: string, contraventionGuid: string, partyGuid: string | null): Promise<Investigation> {
    try {
      await withRlsTransaction(this.prisma, async (db) => {
        const contravention = await db.contravention.findUnique({
          where: { contravention_guid: contraventionGuid },
          include: {
            contravention_party_xref: {
              where: { active_ind: true },
            },
          },
        });

        if (!contravention) throw new Error("Contravention not found");

        const otherParties = contravention.contravention_party_xref.filter(
          (xref) => xref.investigation_party_guid !== partyGuid,
        );

        if (otherParties.length > 0) {
          //Shared contravention — only deactivate this party's xref
          await db.contravention_party_xref.updateMany({
            where: {
              contravention_guid: contraventionGuid,
              investigation_party_guid: partyGuid,
              active_ind: true,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });

          //Check if any active xrefs remain after deactivation
          const remainingXrefs = await db.contravention_party_xref.count({
            where: {
              contravention_guid: contraventionGuid,
              active_ind: true,
            },
          });

          //If no parties left, deactivate the contravention itself
          if (remainingXrefs === 0) {
            await db.contravention.update({
              where: { contravention_guid: contraventionGuid },
              data: {
                active_ind: false,
                update_user_id: this.user.getIdirUsername(),
                update_utc_timestamp: new Date(),
              },
            });
          }
        } else {
          //This is the only party — deactivate the contravention itself
          await db.contravention.update({
            where: { contravention_guid: contraventionGuid },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        }
      });
    } catch (error) {
      this.logger.error("Error removing contravention:", error);
      throw error;
    }

    await this.investigationService.updateInvestigationTimestamp(investigationGuid);

    return await this.investigationService.findOne(investigationGuid);
  }

  async update(contraventionGuid: string, input: CreateUpdateContraventionInput): Promise<Investigation> {
    const stored = await this.prisma.contravention.findUnique({
      where: { contravention_guid: contraventionGuid },
      select: { legislation_guid_ref: true, contravention_date: true },
    });

    if (!stored) throw new Error("Contravention not found");

    const contraventionDate = toDateString(input.date);
    const dateChanged = contraventionDate !== toDateString(stored.contravention_date);
    const referenceChanged = input.legislationReference !== stored.legislation_guid_ref;

    if (dateChanged) {
      this.validateContraventionDate(contraventionDate);
    }

    if (referenceChanged || dateChanged) {
      await this.validateLegislationReference(input.legislationReference, contraventionDate);
    }

    try {
      await withRlsTransaction(this.prisma, async (db) => {
        const originalContravention = await db.contravention.findUnique({
          where: { contravention_guid: contraventionGuid },
          include: {
            contravention_party_xref: {
              where: { active_ind: true },
            },
          },
        });

        if (!originalContravention) throw new Error("Contravention not found");

        const investigationPartyGuid = input.investigationPartyGuids?.[0];

        if (investigationPartyGuid === null) {
          await db.contravention_party_xref.updateMany({
            where: {
              contravention_guid: contraventionGuid,
              active_ind: true,
              investigation_party_guid: input.selectedPartyGuid,
            },
            data: {
              active_ind: false,
              update_user_id: this.user.getIdirUsername(),
              update_utc_timestamp: new Date(),
            },
          });
        } else {
          const existingParty = originalContravention.contravention_party_xref.filter(
            (xref) => xref.investigation_party_guid == input.selectedPartyGuid,
          );

          if (existingParty?.length > 0) {
            await db.contravention_party_xref.updateMany({
              where: {
                contravention_guid: contraventionGuid,
                investigation_party_guid: existingParty[0].investigation_party_guid,
                active_ind: true,
              },
              data: {
                update_user_id: this.user.getIdirUsername(),
                update_utc_timestamp: new Date(),
                investigation_party_guid: investigationPartyGuid,
              },
            });
          } else {
            await db.contravention_party_xref.create({
              data: {
                contravention_guid: contraventionGuid,
                investigation_party_guid: investigationPartyGuid,
                active_ind: true,
                create_user_id: this.user.getIdirUsername(),
                create_utc_timestamp: new Date(),
              },
            });
          }
        }
        await db.contravention.update({
          where: { contravention_guid: contraventionGuid },
          data: {
            legislation_guid_ref: input.legislationReference,
            contravention_date: input.date,
            geo_organization_unit_code_ref: input.community,
            update_user_id: this.user.getIdirUsername(),
            update_utc_timestamp: new Date(),
          },
        });
      });
    } catch (error) {
      this.logger.error("Error updating contravention:", error);
      throw error;
    }
    await this.investigationService.updateInvestigationTimestamp(input.investigationGuid);

    return await this.investigationService.findOne(input.investigationGuid);
  }

  private validateContraventionDate(contraventionDate: string | null): void {
    if (contraventionDate && contraventionDate > getCurrentDatePacific()) {
      throw new GraphQLError("The contravention date cannot be in the future.", {});
    }
  }

  private async validateLegislationReference(legislationGuid: string, contraventionDate: string | null): Promise<void> {
    if (!contraventionDate) {
      return;
    }

    const node = await this.sharedPrisma.legislation.findUnique({
      where: { legislation_guid: legislationGuid },
      include: { legislation_version: true },
    });

    if (!node) {
      throw new GraphQLError("The selected legislation could not be found.", {});
    }

    const version = node.legislation_version;

    if (version.import_status !== "SUCCESS") {
      throw new GraphQLError("The selected legislation belongs to a version that has not been imported.", {});
    }

    const effectiveDate = toDateString(version.effective_date);

    if (!effectiveDate || effectiveDate > contraventionDate) {
      throw new GraphQLError(
        `The selected legislation was not in force on ${contraventionDate}. Select legislation from the version in force on the contravention date.`,
        {},
      );
    }

    const supersedingVersion = await this.sharedPrisma.legislation_version.findFirst({
      where: {
        legislation_source_guid: version.legislation_source_guid,
        import_status: "SUCCESS",
        effective_date: { gt: version.effective_date, lte: toDate(contraventionDate) },
      },
      orderBy: { effective_date: "desc" },
    });

    if (supersedingVersion) {
      throw new GraphQLError(
        `The selected legislation is from a version that was superseded on ${toDateString(supersedingVersion.effective_date)}. Select legislation from the version in force on the contravention date.`,
        {},
      );
    }
  }
}
