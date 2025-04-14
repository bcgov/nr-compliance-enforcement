import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { CreatePersonComplaintXrefDto } from "./dto/create-person_complaint_xref.dto";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { ComplaintService } from "../complaint/complaint.service";
import { getIdirFromRequest } from "src/common/get-idir-from-request";
import { REQUEST } from "@nestjs/core";
import { PersonComplaintXrefCodeEnum } from "src/enum/person_complaint_xref_code.enum";
import { Officer } from "../officer/entities/officer.entity";
import { Office } from "../office/entities/office.entity";
import { UUID } from "crypto";

@Injectable()
export class PersonComplaintXrefService {
  @InjectRepository(PersonComplaintXref)
  private readonly personComplaintXrefRepository: Repository<PersonComplaintXref>;

  private readonly logger = new Logger(PersonComplaintXrefService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ComplaintService)) private readonly _complaintService: ComplaintService,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async create(createPersonComplaintXrefDto: CreatePersonComplaintXrefDto): Promise<PersonComplaintXref> {
    const newPersonComplaintXref = this.personComplaintXrefRepository.create(createPersonComplaintXrefDto);
    return newPersonComplaintXref;
  }

  async findAll(): Promise<PersonComplaintXref[]> {
    return this.personComplaintXrefRepository.find({
      relations: {
        person_guid: true,
        complaint_identifier: true,
      },
    });
  }

  async findOne(person_complaint_xref_guid: any): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.findOne({
      where: { personComplaintXrefGuid: person_complaint_xref_guid },
      relations: {
        person_guid: true,
        complaint_identifier: true,
      },
    });
  }

  async findAssigned(person_guid: string, complaint_identifier: string): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository
      .createQueryBuilder("personComplaintXref")
      .leftJoinAndSelect("personComplaintXref.person_guid", "person_guid")
      .leftJoinAndSelect("personComplaintXref.complaint_identifier", "complaint_identifier")
      .where("personComplaintXref.person_guid = :person_guid", { person_guid })
      .andWhere("personComplaintXref.complaint_identifier = :complaint_identifier", { complaint_identifier })
      .andWhere("personComplaintXref.person_complaint_xref_code = :person_complaint_xref_code", {
        person_complaint_xref_code: "ASSIGNEE",
      })
      .andWhere("personComplaintXref.active_ind = :active_ind", {
        active_ind: true,
      })
      .getOne();
  }

  async findAssignedByComplaint(complaint_identifier: any): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.findOne({
      where: {
        complaint_identifier: complaint_identifier,
        person_complaint_xref_code: "ASSIGNEE" as any,
        active_ind: true,
      },
      relations: {
        person_guid: true,
        complaint_identifier: true,
      },
    });
  }

  async update(person_complaint_xref_guid: any, updatePersonComplaintXrefDto): Promise<PersonComplaintXref> {
    const updatedValue = await this.personComplaintXrefRepository.update(
      person_complaint_xref_guid,
      updatePersonComplaintXrefDto,
    );
    return this.findOne(person_complaint_xref_guid);
  }

  /**
   *
   * Update the complaint last updated date on the parent record
   */
  async updateComplaintLastUpdatedDate(
    complaintIdentifier: string,
    newPersonComplaintXref: PersonComplaintXref,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (await this._complaintService.updateComplaintLastUpdatedDate(complaintIdentifier)) {
      // save the transaction
      await queryRunner.manager.save(newPersonComplaintXref);
      this.logger.debug(`Successfully assigned person to complaint ${complaintIdentifier}`);
    } else {
      throw new BadRequestException(`Unable to assign person to complaint ${complaintIdentifier}`);
    }
  }

  /**
   * Assigns an officer to a complaint.  This will perform one of two operations.
   * If the existing complaint is not yet assigned to an officer, then this will create a new complaint/officer cross reference.
   * As such, this exists as a queryRunner transaction.  If there's an exception, the entire transcation is rolled back.
   *
   * If the complaint is already assigned to an officer and the intention is to reassign the complaint to another officer, then first deactivate the first assignment and then
   * create a new cross reference between the complaint and officer.
   */
  async assignNewOfficer(
    complaintIdentifier: string,
    createPersonComplaintXrefDto: CreatePersonComplaintXrefDto,
  ): Promise<PersonComplaintXref> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    this.logger.debug(`Assigning Complaint ${complaintIdentifier}`);
    let newPersonComplaintXref: PersonComplaintXref;
    let unassignedPersonComplaintXref: PersonComplaintXref;

    try {
      // unassign complaint if it's already assigned to an officer
      unassignedPersonComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedPersonComplaintXref) {
        this.logger.debug(
          `Unassigning existing person from complaint ${unassignedPersonComplaintXref?.complaint_identifier?.complaint_identifier}`,
        );
        unassignedPersonComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedPersonComplaintXref);
      }
      // create a new complaint assignment record
      newPersonComplaintXref = await this.create(createPersonComplaintXrefDto);
      this.logger.debug(`Updating assignment on complaint ${complaintIdentifier}`);

      // Update the complaint last updated date on the parent record
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, newPersonComplaintXref, queryRunner);

      await queryRunner.commitTransaction();
      this.logger.debug(`Successfully assigned person to complaint ${complaintIdentifier}`);
    } catch (err) {
      this.logger.error(err);
      this.logger.error(`Rolling back assignment on complaint ${complaintIdentifier}`);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newPersonComplaintXref;
  }

  /**
   * Assigns an officer to a complaint.  This will perform one of two operations.
   * If the existing complaint is not yet assigned to an officer, then this will create a new complaint/officer cross reference.
   * As such, this exists as a queryRunner transaction.  If there's an exception, the entire transcation is rolled back.
   *
   * If the complaint is already assigned to an officer and the intention is to reassign the complaint to another officer, then first deactivate the first assignment and then
   * create a new cross reference between the complaint and officer.
   */
  async assignOfficer(
    queryRunner: QueryRunner,
    complaintIdentifier: string,
    createPersonComplaintXrefDto: CreatePersonComplaintXrefDto,
    closeConnection?: boolean, // should the connection be closed once completed.  Necessary because if this is part of another transaction, then that transaction will handle releasing the connection; otherwise, best to set to true so that the connection is released.
  ): Promise<PersonComplaintXref> {
    this.logger.debug(`Assigning Complaint ${complaintIdentifier}`);
    let newPersonComplaintXref: PersonComplaintXref;
    let unassignedPersonComplaintXref: PersonComplaintXref;

    try {
      // unassign complaint if it's already assigned to an officer
      unassignedPersonComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedPersonComplaintXref) {
        this.logger.debug(
          `Unassigning existing person ${unassignedPersonComplaintXref.person_guid.person_guid} from complaint ${unassignedPersonComplaintXref?.complaint_identifier?.complaint_identifier}`,
        );
        unassignedPersonComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedPersonComplaintXref);
      }
      // create a new complaint assignment record
      newPersonComplaintXref = await this.create(createPersonComplaintXrefDto);
      this.logger.debug(`Updating assignment on complaint ${complaintIdentifier}`);

      // Update the complaint last updated date on the parent record
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, newPersonComplaintXref, queryRunner);
    } catch (err) {
      this.logger.error(err);
      this.logger.error(`Rolling back assignment on complaint ${complaintIdentifier}`);
      throw new BadRequestException(err);
    } finally {
      if (closeConnection) {
        await queryRunner.release();
      }
    }
    return newPersonComplaintXref;
  }

  async clearAssignedOfficer(complaintIdentifier: string): Promise<void> {
    try {
      const unassignedPersonComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedPersonComplaintXref) {
        this.logger.debug(
          `Unassigning person xref ${unassignedPersonComplaintXref.personComplaintXrefGuid} existing person ${unassignedPersonComplaintXref.person_guid.person_guid} from complaint ${unassignedPersonComplaintXref?.complaint_identifier?.complaint_identifier}`,
        );
        await this.personComplaintXrefRepository.update(unassignedPersonComplaintXref.personComplaintXrefGuid, {
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
    return `This action removes a #${id} personComplaintXref`;
  }

  async unAssignOfficer(complaintIdentifier: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let unassignedPersonComplaintXref: PersonComplaintXref;

    try {
      unassignedPersonComplaintXref = await this.findAssignedByComplaint(complaintIdentifier);
      if (unassignedPersonComplaintXref) {
        unassignedPersonComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedPersonComplaintXref);
      }
      const returnValue = await this._complaintService.updateComplaintLastUpdatedDate(complaintIdentifier);
      if (!returnValue) {
        throw new BadRequestException(`Unable to remove assignment person to complaint ${complaintIdentifier}`);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async addCollaboratorToComplaint(complaintIdentifier: string, personGuid: string): Promise<PersonComplaintXref> {
    this.logger.debug(`Adding collaborator ${personGuid} Complaint ${complaintIdentifier}`);
    let newPersonComplaintXref: PersonComplaintXref;
    const currentUserId = getIdirFromRequest(this.request);
    const createPersonComplaintXrefDto = {
      active_ind: true,
      person_guid: {
        person_guid: personGuid,
      },
      complaint_identifier: complaintIdentifier,
      person_complaint_xref_code: "COLLABORAT",
      create_user_id: currentUserId,
    } as any; // When typed as CreatePersonComplaintXrefDto complaint_identifier is expecting a conplaint, not a string.
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // create a new record representing the collaboration
      newPersonComplaintXref = await this.create(createPersonComplaintXrefDto);
      this.logger.debug(`Adding collaborator ${personGuid} to complaint ${complaintIdentifier}`);

      // Update the complaint last updated date on the parent record
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, newPersonComplaintXref, queryRunner);
      await queryRunner.commitTransaction();
      this.logger.debug(`Succesfully added collaborator ${personGuid} to complaint ${complaintIdentifier}`);
    } catch (err) {
      this.logger.error(err);
      this.logger.error(`Rolling back collaborator assignment of ${personGuid} on complaint ${complaintIdentifier}`);
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
    return newPersonComplaintXref;
  }

  async removeCollaboratorFromComplaint(complaintIdentifier: string, personComplaintXrefGuid: UUID) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let removedCollaborator: PersonComplaintXref;

    try {
      this.logger.debug(`Removing collaborator from complaint ${complaintIdentifier}`);

      // Find and update the collaboration record
      removedCollaborator = await this.personComplaintXrefRepository.findOne({
        where: {
          personComplaintXrefGuid: personComplaintXrefGuid,
        },
      });

      if (!removedCollaborator) {
        throw new BadRequestException(`Could not find collaboration record ${personComplaintXrefGuid}`);
      }

      removedCollaborator.active_ind = false;
      await queryRunner.manager.save(removedCollaborator);

      // Update the complaint last updated date
      await this.updateComplaintLastUpdatedDate(complaintIdentifier, removedCollaborator, queryRunner);

      await queryRunner.commitTransaction();

      return removedCollaborator;
    } catch (err) {
      this.logger.error(`Error removing collaborator record ${personComplaintXrefGuid} `);
      this.logger.error(`Error details: ${err.message}`);
      this.logger.error(err.stack);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err);
    } finally {
      await queryRunner.release();
    }
  }

  async getCollaborators(complaintIdentifier: string): Promise<PersonComplaintXref[]> {
    const res = await this.personComplaintXrefRepository
      .createQueryBuilder("person_complaint_xref")
      .leftJoinAndSelect("person_complaint_xref.person_guid", "person")
      .innerJoin(Officer, "officer", "person.person_guid=officer.person_guid")
      .where("person_complaint_xref.complaint_identifier = :complaintId", { complaintId: complaintIdentifier })
      .andWhere("person_complaint_xref.person_complaint_xref_code = :code", {
        code: PersonComplaintXrefCodeEnum.COLLABORATOR,
      })
      .andWhere("person_complaint_xref.active_ind = true")
      .andWhere("officer.person_guid = person.person_guid")
      .addSelect("officer.agency_code")
      .execute();

    const collaborators = res.map((row) => {
      return {
        personComplaintXrefGuid: row.person_complaint_xref_person_complaint_xref_guid,
        complaintId: row.person_complaint_xref_complaint_identifier,
        personGuid: row.person_complaint_xref_person_guid,
        collaboratorAgency: row.officer_agency_code,
        firstName: row.person_first_name,
        lastName: row.person_last_name,
        middleName1: row.person_middle_name_1,
        middleName2: row.person_middle_name_2,
      };
    });
    return collaborators;
  }
}
