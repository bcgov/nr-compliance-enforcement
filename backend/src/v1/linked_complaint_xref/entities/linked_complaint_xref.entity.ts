import { Complaint } from "../../complaint/entities/complaint.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "crypto";

@Index("PK_linked_complaint_xref_guid", ["linkedComplaintXrefGuid"], {
  unique: true,
})
@Entity("linked_complaint_xref", { schema: "public" })
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

  @ManyToOne(() => Complaint, (complaint) => complaint.complaint_identifier)
  @JoinColumn([{ name: "complaint_identifier" }])
  complaint_identifier: Complaint;

  @ManyToOne(() => Complaint, (complaint) => complaint.complaint_identifier)
  @JoinColumn([{ name: "complaint_identifier" }])
  linked_complaint_identifier: Complaint;
}
