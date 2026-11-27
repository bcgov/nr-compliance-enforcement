import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "node:crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";

@Entity("complaint_attachment_reference", { schema: "complaint" })
export class ComplaintAttachmentReference {
  @Column("uuid", {
    primary: true,
    name: "complaint_attachment_reference_guid",
    default: () => "uuid_generate_v4()",
  })
  complaint_attachment_reference_guid: UUID;

  @ManyToOne(() => Complaint, (complaint) => complaint.complaint_identifier)
  @JoinColumn([{ name: "complaint_identifier", referencedColumnName: "complaint_identifier" }])
  @Column("character varying", { name: "complaint_identifier" })
  complaint_identifier: string;

  @Column("uuid", { name: "chefs_file_guid_ref" })
  chefs_file_guid_ref: UUID;

  @Column("character varying", { name: "filename_text", length: 1024 })
  filename_text: string;

  @Column("integer", { name: "file_size" })
  file_size: number;

  @Column("boolean", { name: "active_ind" })
  active_ind: boolean;

  @Column("character varying", { name: "create_user_id", length: 32 })
  create_user_id: string;

  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  create_utc_timestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32, nullable: true })
  update_user_id: string;

  @Column("timestamp without time zone", { name: "update_utc_timestamp", nullable: true })
  update_utc_timestamp: Date;
}
