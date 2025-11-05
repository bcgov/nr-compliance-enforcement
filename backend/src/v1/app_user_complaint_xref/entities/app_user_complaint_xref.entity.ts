import { Complaint } from "../../complaint/entities/complaint.entity";
import { AppUserComplaintXrefCode } from "../../app_user_complaint_xref_code/entities/app_user_complaint_xref_code.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "node:crypto";

/**
 * Links app users to complaints with specific relationship types (assignee, collaborator, suspect, etc.)
 */
@Index("PK_app_user_complaint_xref_guid", ["appUserComplaintXrefGuid"], {
  unique: true,
})
@Entity("app_user_complaint_xref", { schema: "complaint" })
export class AppUserComplaintXref {
  @Column("uuid", {
    primary: true,
    name: "app_user_complaint_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  appUserComplaintXrefGuid: UUID;

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

  @ManyToOne(() => Complaint, (complaint) => complaint.app_user_complaint_xref)
  @JoinColumn([
    {
      name: "complaint_identifier",
      referencedColumnName: "complaint_identifier",
    },
  ])
  complaint_identifier: Complaint;

  @ManyToOne(() => AppUserComplaintXrefCode, (code) => code.appUserComplaintXrefs)
  @JoinColumn([
    {
      name: "app_user_complaint_xref_code",
      referencedColumnName: "app_user_complaint_xref_code",
    },
  ])
  app_user_complaint_xref_code: AppUserComplaintXrefCode;

  @Column("uuid", { name: "app_user_guid_ref" })
  app_user_guid: UUID;
}
