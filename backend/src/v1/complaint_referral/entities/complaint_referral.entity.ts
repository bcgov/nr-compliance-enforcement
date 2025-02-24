import { Complaint } from "../../complaint/entities/complaint.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "crypto";
import { AgencyCode } from "../../agency_code/entities/agency_code.entity";
import { Officer } from "../../officer/entities/officer.entity";

@Index("PK_cmplreferral", ["complaint_referral_guid"], {
  unique: true,
})
@Entity("complaint_referral", { schema: "public" })
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

  @Column("character varying", { name: "complaint_identifier" })
  complaint_identifier: string;

  @ManyToOne(() => AgencyCode, (agencyCode) => agencyCode.agency_code)
  @JoinColumn([{ name: "referred_by_agency_code", referencedColumnName: "agency_code" }])
  referred_by_agency_code: AgencyCode;

  @ManyToOne(() => AgencyCode, (agencyCode) => agencyCode.agency_code)
  @JoinColumn([{ name: "referred_to_agency_code", referencedColumnName: "agency_code" }])
  referred_to_agency_code: AgencyCode;

  @ManyToOne(() => Officer, (officer) => officer.officer_guid)
  @JoinColumn({ name: "officer_guid" })
  officer_guid: Officer;

  @Column("timestamp without time zone", { name: "referral_date" })
  referral_date: Date;

  @Column("character varying", { name: "referral_reason", length: 1000 })
  referral_reason: string;
}
