import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "node:crypto";
import { Complaint } from "../../complaint/entities/complaint.entity";

@Index("PK_cmplreferral", ["complaint_referral_guid"], {
  unique: true,
})
@Entity("complaint_referral", { schema: "complaint" })
export class ComplaintReferral {
  @Column("uuid", {
    primary: true,
    name: "complaint_referral_guid",
    default: () => "uuid_generate_v4()",
  })
  complaint_referral_guid: UUID;

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
  @JoinColumn([{ name: "complaint_identifier", referencedColumnName: "complaint_identifier" }])
  @Column("character varying", { name: "complaint_identifier" })
  complaint_identifier: string;

  @Column("character varying", { name: "referred_by_agency_code_ref" })
  referred_by_agency_code_ref: string;

  @Column("character varying", { name: "referred_to_agency_code_ref" })
  referred_to_agency_code_ref: string;

  @Column("uuid", { name: "app_user_guid_ref", nullable: true })
  app_user_guid_ref: UUID;

  @Column("timestamp without time zone", { name: "referral_date" })
  referral_date: Date;

  @Column("character varying", { name: "referral_reason", length: 500 })
  referral_reason: string;
}
