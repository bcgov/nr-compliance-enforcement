import { PersonComplaintXref } from "src/v1/person_complaint_xref/entities/person_complaint_xref.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";

@Index("PK_person_complaint_xref_code", ["person_complaint_xref_code"], {
  unique: true,
})
@Entity("person_complaint_xref_code", { schema: "public" })
export class PersonComplaintXrefCode {
  @Column("character varying", {
    primary: true,
    name: "person_complaint_xref_code",
    length: 10,
  })
  person_complaint_xref_code: string;

  @Column("character varying", { name: "short_description", length: 50 })
  short_description: string;

  @Column("character varying", {
    name: "long_description",
    nullable: true,
    length: 250,
  })
  long_description: string | null;

  @Column("integer", { name: "display_order" })
  display_order: number;

  @Column("boolean", { name: "active_ind" })
  active_ind: boolean;

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

  @OneToMany(
    () => PersonComplaintXref,
    (personComplaintXref) => personComplaintXref.person_complaint_xref_code
  )
  personComplaintXrefs: PersonComplaintXref[];
}
