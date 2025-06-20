import { Complaint } from "../../complaint/entities/complaint.entity";
import { Person } from "../../person/entities/person.entity";
import { PersonComplaintXrefCode } from "../../person_complaint_xref_code/entities/person_complaint_xref_code.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "crypto";

@Index("PK_person_complaint_xref_guid", ["personComplaintXrefGuid"], {
  unique: true,
})
@Entity("person_complaint_xref", { schema: "complaint" })
export class PersonComplaintXref {
  @Column("uuid", {
    primary: true,
    name: "person_complaint_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  personComplaintXrefGuid: UUID;

  @Column("character varying", { name: "create_user_id", length: 32 })
  create_user_id: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  create_utc_timestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  update_user_id: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  update_utc_timestamp: Date;

  @Column("boolean", { name: "active_ind" })
  active_ind: boolean;

  @ManyToOne(() => Complaint, (complaint) => complaint.person_complaint_xref)
  @JoinColumn([
    {
      name: "complaint_identifier",
      referencedColumnName: "complaint_identifier",
    },
  ])
  complaint_identifier: Complaint;

  @ManyToOne(() => PersonComplaintXrefCode, (personComplaintXrefCode) => personComplaintXrefCode.personComplaintXrefs)
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
