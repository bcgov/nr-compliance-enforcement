import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { CreateAppUserComplaintXrefDto } from "./dto/create-app_user_complaint_xref.dto";
import { AppUserComplaintXref } from "./entities/app_user_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { ComplaintService } from "../complaint/complaint.service";
import { getIdirFromRequest } from "../../common/get-idir-from-request";
import { REQUEST } from "@nestjs/core";
import { AppUserComplaintXrefCodeEnum } from "../../enum/app_user_complaint_xref_code.enum";
import { UUID } from "node:crypto";
import { EmailService } from "../email/email.service";
import { SendCollaboratorEmalDto } from "../email/dto/send_collaborator_email.dto";
import { WebeocService } from "../../external_api/webeoc/webeoc.service";
import { FeatureFlagService } from "../../v1/feature_flag/feature_flag.service";
import { AppUserService } from "../../v1/app_user/app_user.service";
import { getAppUserByGuid } from "../../external_api/shared_data";

@Injectable()
export class AppUserComplaintXrefService {
  @InjectRepository(AppUserComplaintXref)
  private readonly repository: Repository<AppUserComplaintXref>;

  private readonly logger = new Logger(AppUserComplaintXrefService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ComplaintService)) private readonly _complaintService: ComplaintService,
    @Inject(forwardRef(() => EmailService))
    private readonly _emailService: EmailService,
    private readonly _webeocService: WebeocService,
    @Inject(REQUEST)
    private readonly request: Request,
    @Inject(FeatureFlagService)
    private readonly _featureFlagService: FeatureFlagService,
    private readonly _appUserService: AppUserService,
  ) {}

  async create(createAppUserComplaintXrefDto: CreateAppUserComplaintXrefDto): Promise<AppUserComplaintXref> {
    const newAppUserComplaintXref = this.repository.create(createAppUserComplaintXrefDto);
    return newAppUserComplaintXref;
  }

  async findAll(): Promise<AppUserComplaintXref[]> {
    return this.repository.find({
      relations: {
        complaint_identifier: true,
      },
    });
  }

  async findOne(app_user_complaint_xref_guid: any): Promise<AppUserComplaintXref> {
    return this.repository.findOne({
      where: { appUserComplaintXrefGuid: app_user_complaint_xref_guid },
      relations: {
        complaint_identifier: true,
      },
    });
  }

  async findAssigned(app_user_guid: string, complaint_identifier: string): Promise<AppUserComplaintXref> {
    return this.repository
      .createQueryBuilder("app_user_complaint_xref")
      .leftJoinAndSelect("app_user_complaint_xref.complaint_identifier", "complaint_identifier")
      .where("app_user_complaint_xref.app_user_guid = :app_user_guid", { app_user_guid })
      .andWhere("app_user_complaint_xref.complaint_identifier = :complaint_identifier", { complaint_identifier })
      .andWhere("app_user_complaint_xref.app_user_complaint_xref_code = :app_user_complaint_xref_code", {
        app_user_complaint_xref_code: "ASSIGNEE",
      })
      .andWhere("app_user_complaint_xref.active_ind = :active_ind", {
        active_ind: true,
      })
      .getOne();
  }

  async findAssignedByComplaint(complaint_identifier: any): Promise<AppUserComplaintXref> {
    return this.repository.findOne({
      where: {
        complaint_identifier: complaint_identifier,
        app_user_complaint_xref_code: "ASSIGNEE" as any,
        active_ind: true,
      },
      relations: {
        complaint_identifier: true,
      },
    });
  }

  async findAllAssigneesByComplaint(complaint_identifier: any): Promise<AppUserComplaintXref[]> {
    return this.repository.find({
      where: {
        complaint_identifier: complaint_identifier,
        app_user_complaint_xref_code: "ASSIGNEE" as any,
      },
      relations: {
        complaint_identifier: true,
      },
    });
  }

  async update(app_user_complaint_xref_guid: any, updateAppUserComplaintXrefDto): Promise<AppUserComplaintXref> {
    await this.repository.update(app_user_complaint_xref_guid, updateAppUserComplaintXrefDto);
    return this.findOne(app_user_complaint_xref_guid);
  }

  /**
   *
   * Update the complaint last updated date on the parent record
   */
  async updateComplaintLastUpdatedDate(
    complaintIdentifier: string,
    newAppUserComplaintXref: AppUserComplaintXref,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (await this._complaintService.updateComplaintLastUpdatedDate(complaintIdentifier)) {
      // save the transaction
      await queryRunner.manager.save(newAppUserComplaintXref);
      this.logger.debug(`Successfully assigned app user to complaint ${complaintIdentifier}`);
    } else {
      throw new BadRequestException(`Unable to assign app user to complaint ${complaintIdentifier}`);
    }
  }

  /**
   * Assigns an app user to a complaint.  This will perform one of two operations.
   * If the existing complaint is not yet assigned to an app user, then this will create a new complaint/app user cross reference.
   * As such, this exists as a queryRunner transaction.  If there's an exception, the entire transaction is rolled back.
   *
   * If the complaint is already assigned to an app user and the intention is to reassign the complaint to another app user, then first deactivate the first assignment and then
   * create a new cross reference between the complaint and app user.
   */
  async assignNewAppUser(
    complaintIdentifier: string,
    createAppUserComplaintXrefDto: CreateAppUserComplaintXrefDto,
  ): Promise<AppUserComplaintXref> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.logger.debug(`Assigning Complaint ${complaintIdentifier}`);
    let newAppUserComplaintXref: AppUserComplaintXref;
    let unassignedAppUserComplaintXref: AppUserComplaintXref;
    let allAssignments: AppUserComplaintXref[];
    let hasHadAssignmentBefore = false;

    try {
      // check if this complaint has ever had an app user assigned before
      allAssignments = await this.findAllAssigneesByComplaint(complaintIdentifier);
      if (allAssignments && allAssignments.length > 0) {
        hasHadAssignmentBefore = true;
      }
      // unassign complaint if it's already assigned to an app user
      unassignedAppUserComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedAppUserComplaintXref) {
        this.logger.debug(
          `Unassigning existing app user from complaint ${unassignedAppUserComplaintXref?.complaint_identifier?.complaint_identifier}`,
        );
        unassignedAppUserComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedAppUserComplaintXref);
      }
      // create a new complaint assignment record
      newAppUserComplaintXref = await this.create(createAppUserComplaintXrefDto);
      this.logger.debug(`Updating assignment on complaint ${complaintIdentifier}`);

      // Update the complaint last updated date on the parent record
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, newAppUserComplaintXref, queryRunner);

      await queryRunner.commitTransaction();
      this.logger.debug(`Successfully assigned app user to complaint ${complaintIdentifier}`);

      if (!hasHadAssignmentBefore) {
        await this.updateWebEOC(complaintIdentifier);
      }
    } catch (err) {
      this.logger.error(err);
      this.logger.error(`Rolling back assignment on complaint ${complaintIdentifier}`);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newAppUserComplaintXref;
  }

  /**
   * Assigns an app user to a complaint.  This will perform one of two operations.
   * If the existing complaint is not yet assigned to an app user, then this will create a new complaint/app user cross reference.
   * As such, this exists as a queryRunner transaction.  If there's an exception, the entire transaction is rolled back.
   *
   * If the complaint is already assigned to an app user and the intention is to reassign the complaint to another app user, then first deactivate the first assignment and then
   * create a new cross reference between the complaint and app user.
   */
  async assignAppUser(
    queryRunner: QueryRunner,
    complaintIdentifier: string,
    createAppUserComplaintXrefDto: CreateAppUserComplaintXrefDto,
    closeConnection?: boolean, // should the connection be closed once completed.  Necessary because if this is part of another transaction, then that transaction will handle releasing the connection; otherwise, best to set to true so that the connection is released.
  ): Promise<AppUserComplaintXref> {
    this.logger.debug(`Assigning Complaint ${complaintIdentifier}`);
    let newAppUserComplaintXref: AppUserComplaintXref;
    let unassignedAppUserComplaintXref: AppUserComplaintXref;
    let allAssignments: AppUserComplaintXref[];
    let hasHadAssignmentBefore = false;

    try {
      // check if this complaint has ever had an app user assigned before
      allAssignments = await this.findAllAssigneesByComplaint(complaintIdentifier);
      if (allAssignments && allAssignments.length > 0) {
        hasHadAssignmentBefore = true;
      }
      // unassign complaint if it's already assigned to an app user
      unassignedAppUserComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedAppUserComplaintXref) {
        this.logger.debug(
          `Unassigning existing app user ${unassignedAppUserComplaintXref.app_user_guid} from complaint ${unassignedAppUserComplaintXref?.complaint_identifier?.complaint_identifier}`,
        );
        unassignedAppUserComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedAppUserComplaintXref);
      }
      // create a new complaint assignment record
      newAppUserComplaintXref = await this.create(createAppUserComplaintXrefDto);
      this.logger.debug(`Updating assignment on complaint ${complaintIdentifier}`);

      // Update the complaint last updated date on the parent record
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, newAppUserComplaintXref, queryRunner);

      //Update webEOC - Note session handling might be refactored in the future.
      if (!hasHadAssignmentBefore) {
        await this.updateWebEOC(complaintIdentifier);
      }
    } catch (err) {
      throw new BadRequestException(err);
    } finally {
      if (closeConnection) {
        await queryRunner.release();
      }
    }
    return newAppUserComplaintXref;
  }

  async clearAssignedAppUser(complaintIdentifier: string): Promise<void> {
    try {
      const unassignedAppUserComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedAppUserComplaintXref) {
        this.logger.debug(
          `Unassigning app user xref ${unassignedAppUserComplaintXref.appUserComplaintXrefGuid} existing app user ${unassignedAppUserComplaintXref.app_user_guid} from complaint ${unassignedAppUserComplaintXref?.complaint_identifier?.complaint_identifier}`,
        );
        await this.repository.update(unassignedAppUserComplaintXref.appUserComplaintXrefGuid, {
          active_ind: false,
        });
        // Update the complaint last updated date on the parent record
        await this._complaintService.updateComplaintLastUpdatedDate(complaintIdentifier);
      }
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} appUserComplaintXref`;
  }

  async unAssignAppUser(complaintIdentifier: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let unassignedAppUserComplaintXref: AppUserComplaintXref;

    try {
      unassignedAppUserComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedAppUserComplaintXref) {
        unassignedAppUserComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedAppUserComplaintXref);
      }
      const returnValue = await this._complaintService.updateComplaintLastUpdatedDate(complaintIdentifier);
      if (!returnValue) {
        throw new BadRequestException(`Unable to remove app user assignment to complaint ${complaintIdentifier}`);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async addCollaboratorToComplaint(
    complaintIdentifier: string,
    appUserGuid: string,
    sendCollaboratorEmailDto: SendCollaboratorEmalDto,
    user,
    token: string,
  ): Promise<AppUserComplaintXref> {
    this.logger.debug(`Adding collaborator ${appUserGuid} Complaint ${complaintIdentifier}`);
    let newAppUserComplaintXref: AppUserComplaintXref;
    const currentUserId = getIdirFromRequest(this.request);
    const createAppUserComplaintXrefDto = {
      active_ind: true,
      app_user_guid: appUserGuid,
      complaint_identifier: complaintIdentifier,
      app_user_complaint_xref_code: "COLLABORAT",
      create_user_id: currentUserId,
    } as any; // When typed as CreateAppUserComplaintXrefDto complaint_identifier is expecting a conplaint, not a string.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let sendEmail = false;
    try {
      // create a new record representing the collaboration
      newAppUserComplaintXref = await this.create(createAppUserComplaintXrefDto);
      this.logger.debug(`Adding collaborator ${appUserGuid} to complaint ${complaintIdentifier}`);

      // Update the complaint last updated date on the parent record
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, newAppUserComplaintXref, queryRunner);
      await queryRunner.commitTransaction();
      sendEmail = true;
      this.logger.debug(`Succesfully added collaborator ${appUserGuid} to complaint ${complaintIdentifier}`);
    } catch (err) {
      this.logger.error(err);
      this.logger.error(`Rolling back collaborator assignment of ${appUserGuid} on complaint ${complaintIdentifier}`);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();

      // Check if feature is enabled for both agencies involved
      const idir = getIdirFromRequest(this.request);
      const invitingAppUser = await this._appUserService.findByUserId(idir, token);
      const leadAgencyActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
        invitingAppUser.agency_code_ref,
        "COLEMAIL",
      );
      const collaboratorAppUser = await this._appUserService.findOne(appUserGuid, token);
      const collaboratorAgencyActive = await this._featureFlagService.checkActiveByAgencyAndFeatureCode(
        collaboratorAppUser.agency_code_ref,
        "COLEMAIL",
      );
      if (sendEmail && leadAgencyActive && collaboratorAgencyActive) {
        try {
          await this._emailService.sendCollaboratorEmail(complaintIdentifier, sendCollaboratorEmailDto, user, token);
        } catch (error) {
          this.logger.error(`Error sending collaborator email.`, error);
        }
      }
    }
    return newAppUserComplaintXref;
  }

  async removeCollaboratorFromComplaint(complaintIdentifier: string, appUserComplaintXrefGuid: UUID) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let removedCollaborator: AppUserComplaintXref;

    try {
      this.logger.debug(`Removing collaborator from complaint ${complaintIdentifier}`);

      // Find and update the collaboration record
      removedCollaborator = await this.repository.findOne({
        where: {
          appUserComplaintXrefGuid: appUserComplaintXrefGuid,
        },
      });

      if (!removedCollaborator) {
        throw new BadRequestException(`Could not find collaboration record ${appUserComplaintXrefGuid}`);
      }

      removedCollaborator.active_ind = false;
      await queryRunner.manager.save(removedCollaborator);

      // Update the complaint last updated date
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, removedCollaborator, queryRunner);

      await queryRunner.commitTransaction();

      return removedCollaborator;
    } catch (err) {
      this.logger.error(`Error removing collaborator record ${appUserComplaintXrefGuid} `);
      this.logger.error(`Error details: ${err.message}`);
      this.logger.error(err.stack);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async getCollaborators(complaintIdentifier: string, token: string): Promise<any[]> {
    const xrefs = await this.repository
      .createQueryBuilder("xref")
      .where("xref.complaint_identifier = :complaintId", { complaintId: complaintIdentifier })
      .andWhere("xref.app_user_complaint_xref_code = :code", {
        code: AppUserComplaintXrefCodeEnum.COLLABORATOR,
      })
      .andWhere("xref.active_ind = true")
      .getMany();

    const collaborators = await Promise.all(
      xrefs.map(async (xref) => {
        const appUser = await getAppUserByGuid(token, xref.app_user_guid);
        return {
          appUserComplaintXrefGuid: xref.appUserComplaintXrefGuid,
          complaintId: xref.complaint_identifier,
          appUserGuid: xref.app_user_guid,
          authUserGuid: appUser?.authUserGuid,
          collaboratorAgency: appUser?.agencyCode,
          firstName: appUser?.firstName,
          lastName: appUser?.lastName,
          activeInd: xref.active_ind,
        };
      }),
    );
    return collaborators;
  }

  private async updateWebEOC(complaintIdentifier: string) {
    try {
      const webeocIdentifier = (await this._complaintService.findById(complaintIdentifier)).webeocId;
      if (webeocIdentifier) {
        // Only if it came from webEOC
        await this._webeocService.manageSession("POST");
        await this._webeocService.assignOfficer(webeocIdentifier);
      }
    } catch (error) {
      // The update to webEOC failed, but don't stop me now...
      this.logger.error("Failed to update webEOC", error);
    }
  }
}
