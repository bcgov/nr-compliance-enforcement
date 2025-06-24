import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AgencyCode } from "../../agency_code/entities/agency_code.entity";
import { ViolationCode } from "../../violation_code/entities/violation_code.entity";

@Index("PK_violation_agency_xref_guid", ["violation_agency_xref_guid"], {
  unique: true,
})
@Entity("violation_agency_xref", { schema: "complaint" })
export class ViolationAgencyXref {
  @Column("uuid", {
    primary: true,
    name: "violation_agency_xref_guid",
    default: () => "uuid_generate_v4()",
  })
  violation_agency_xref_guid: string;

  @Column("character varying", { name: "create_user_id", length: 32 })
  create_user_id: string;

  @Column("timestamp without time zone", {
    name: "create_utc_timestamp",
    default: () => "now()",
  })
  create_utc_timestamp: Date;

  @Column("character varying", { name: "update_user_id", length: 32 })
  update_user_id: string;

  @Column("timestamp without time zone", {
    name: "update_utc_timestamp",
    default: () => "now()",
  })
  update_utc_timestamp: Date;

  @Column("boolean", { name: "active_ind", default: () => "true" })
  active_ind: boolean;

  @ManyToOne(() => AgencyCode, (agencyCode) => agencyCode.violationAgencyXrefs, { eager: true })
  @JoinColumn([{ name: "agency_code", referencedColumnName: "agency_code" }])
  agency_code: AgencyCode;

  @ManyToOne(() => ViolationCode, (violationCode) => violationCode.violationAgencyXrefs, { eager: true })
  @JoinColumn([{ name: "violation_code", referencedColumnName: "violation_code" }])
  violation_code: ViolationCode;
}
