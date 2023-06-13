import { Complaint } from "src/v1/complaint/entities/complaint.entity";
import { Person } from "src/v1/person/entities/person.entity";
import { PersonComplaintXrefCode } from "src/v1/person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Index("PK_person_complaint_xref_guid", ["personComplaintXrefGuid"], {
  unique: true,
})
@Entity("person_complaint_xref", { schema: "public" })
export class PersonComplaintXref {
  @Column("uuid", {
    primary: true,
    name: "person_complaint_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  personComplaintXrefGuid: string;

  @Column("character varying", { name: "create_user_id", length: 32 })
  create_user_id: string;

  @Column("uuid", { name: "create_user_guid", nullable: true })
  create_user_guid: string | null;

  @Column("timestamp without time zone", { name: "create_timestamp" })
  create_timestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  update_user_id: string;

  @Column("uuid", { name: "update_user_guid", nullable: true })
  update_user_guid: string | null;

  @Column("timestamp without time zone", { name: "update_timestamp" })
  update_timestamp: Date;

  @ManyToOne(() => Complaint, (complaint) => complaint.person_complaint_xref)
  @JoinColumn([
    {
      name: "complaint_identifier",
      referencedColumnName: "complaint_identifier",
    },
  ])
  complaint_identifier: Complaint;

  @ManyToOne(
    () => PersonComplaintXrefCode,
    (personComplaintXrefCode) => personComplaintXrefCode.personComplaintXrefs
  )
  @JoinColumn([
    {
      name: "person_complaint_xref_code",
      referencedColumnName: "person_complaint_xref_code",
    },
  ])
  person_complaint_xref_code: PersonComplaintXrefCode;

  @ManyToOne(() => Person, (person) => person.personComplaintXrefs)
  @JoinColumn([{ name: "person_guid", referencedColumnName: "person_guid" }])
  person_guid: Person;
}
