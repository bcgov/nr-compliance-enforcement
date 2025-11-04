import { ApiProperty } from "@nestjs/swagger";
import { AppUserComplaintXref } from "../../app_user_complaint_xref/entities/app_user_complaint_xref.entity";
import { Column, Entity, Index, OneToMany } from "typeorm";

@Index("PK_app_user_complaint_xref_code", ["app_user_complaint_xref_code"], {
  unique: true,
})
@Entity("app_user_complaint_xref_code", { schema: "complaint" })
export class AppUserComplaintXrefCode {
  @Column("character varying", {
    primary: true,
    name: "app_user_complaint_xref_code",
    length: 10,
  })
  app_user_complaint_xref_code: string;

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

  @ApiProperty({ example: "True", description: "A boolean indicator to determine if the attractant code is active." })
  @Column()
  active_ind: boolean;

  @Column("character varying", { name: "create_user_id", length: 32 })
  create_user_id: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  create_utc_timestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  update_user_id: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp" })
  update_utc_timestamp: Date;

  @OneToMany(() => AppUserComplaintXref, (xref) => xref.app_user_complaint_xref_code)
  appUserComplaintXrefs: AppUserComplaintXref[];
}
