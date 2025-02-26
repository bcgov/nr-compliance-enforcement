import { BadRequestException, forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { CreatePersonComplaintXrefDto } from "./dto/create-person_complaint_xref.dto";
import { PersonComplaintXref } from "./entities/person_complaint_xref.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { ComplaintService } from "../complaint/complaint.service";

@Injectable()
export class PersonComplaintXrefService {
  @InjectRepository(PersonComplaintXref)
  private readonly personComplaintXrefRepository: Repository<PersonComplaintXref>;

  private readonly logger = new Logger(PersonComplaintXrefService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ComplaintService)) private readonly _complaintService: ComplaintService,
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

  async findByComplaint(complaint_identifier: any): Promise<PersonComplaintXref> {
    return this.personComplaintXrefRepository.findOne({
      where: { complaint_identifier: complaint_identifier, active_ind: true },
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
      unassignedPersonComplaintXref = await this.findByComplaint(complaintIdentifier);
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
      unassignedPersonComplaintXref = await this.findByComplaint(complaintIdentifier);
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

  remove(id: string) {
    return `This action removes a #${id} personComplaintXref`;
  }

  async unAssignOfficer(complaintIdentifier: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let unassignedPersonComplaintXref: PersonComplaintXref;

    try {
      unassignedPersonComplaintXref = await this.findByComplaint(complaintIdentifier);
      if (unassignedPersonComplaintXref) {
        unassignedPersonComplaintXref.active_ind = false;
        await queryRunner.manager.save(unassignedPersonComplaintXref);
      }
      if (await this._complaintService.updateComplaintLastUpdatedDate(complaintIdentifier)) {
      } else {
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
}
