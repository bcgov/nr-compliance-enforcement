import { Officer } from "../../officer/entities/officer.entity";
import { PersonComplaintXref } from "../../person_complaint_xref/entities/person_complaint_xref.entity";
import { Column, Entity, Index, OneToMany, OneToOne } from "typeorm";

@Index("PK_person", ["person_guid"], { unique: true })
@Entity("person", { schema: "public" })
export class Person {
  @Column("uuid", {
    primary: true,
    name: "person_guid",
    default: () => "uuid_generate_v4()",
  })
  person_guid: string;

  @Column("character varying", { name: "first_name", length: 32 })
  first_name: string;

  @Column("character varying", {
    name: "middle_name_1",
    nullable: true,
    length: 32,
  })
  middle_name_1: string | null;

  @Column("character varying", {
    name: "middle_name_2",
    nullable: true,
    length: 32,
  })
  middle_name_2: string | null;

  @Column("character varying", { name: "last_name", length: 32 })
  last_name: string;

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
  updateTimestamp: Date;

  @OneToOne(() => Officer, (officer) => officer.person_guid)
  officer: Officer;

  @OneToMany(
    () => PersonComplaintXref,
    (personComplaintXref) => personComplaintXref.person_guid
  )
  personComplaintXrefs: PersonComplaintXref[];
}
