import { Complaint } from "../../complaint/entities/complaint.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "node:crypto";

@Index("PK_linked_complaint_xref_guid", ["linkedComplaintXrefGuid"], {
  unique: true,
})
@Entity("linked_complaint_xref", { schema: "complaint" })
export class LinkedComplaintXref {
  @Column("uuid", {
    primary: true,
    name: "linked_complaint_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  linkedComplaintXrefGuid: UUID;

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

  @Column("character varying", { name: "complaint_identifier" })
  complaint_id: string;

  @Column("character varying", { name: "linked_complaint_identifier" })
  linked_complaint_id: string;

  @Column("character varying", { name: "link_type", length: 20, default: "DUPLICATE" })
  link_type: string;

  @Column("uuid", { name: "app_user_guid_ref", nullable: true })
  app_user_guid: UUID;

  @ManyToOne(() => Complaint, (complaint) => complaint.linked_complaint_xref)
  @JoinColumn([{ name: "complaint_identifier", referencedColumnName: "complaint_identifier" }])
  complaint_identifier: Complaint;

  @ManyToOne(() => Complaint, (complaint) => complaint.linked_complaint_xref)
  @JoinColumn([{ name: "linked_complaint_identifier", referencedColumnName: "complaint_identifier" }])
  linked_complaint_identifier: Complaint;
}
