import { Column, Entity, Index, JoinColumn, ManyToOne, Point } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Complaint } from "../../../v1/complaint/entities/complaint.entity";

@Index("complaint_update_pk", ["complaintUpdateGuid"], { unique: true })
@Entity("complaint_update", { schema: "public" })
export class ComplaintUpdate {
  @ApiProperty({
    example: "d3b991df-7831-4c75-ab97-8bed38f3cfeb",
    description:
      "System generated unique key for a complaint update.  This key should never be exposed to users via any system utilizing the tables.",
  })
  @Column("uuid", { primary: true, name: "complaint_update_guid" })
  complaintUpdateGuid: string;

  @ApiProperty({
    example: "24-00001",
    description: "unique complaint_identifier from webeoc.",
  })
  @Column("text", { name: "complaint_identifier", nullable: false })
  complaintId: string;

  @ApiProperty({
    example: "2",
    description:
      "An integer that is used to reflect the order that complaint updates were entered into the call center system.",
  })
  @Column("integer", { name: "update_seq_number" })
  updateSeqNumber: number;

  @ApiProperty({
    example: "I saw something trying to abuct a cow",
    description: "Verbatim details of the complaint as recorded by the call centre or through the web form.",
  })
  @Column("text", { name: "upd_detail_text", nullable: true })
  updDetailText: string | null;

  @ApiProperty({
    example: "Near the road, up the street, by the tree, near the funny looking cow.",
    description: "A brief summary of the location of the complaint.",
  })
  @Column("character varying", {
    name: "upd_location_summary_text",
    nullable: true,
    length: 120,
  })
  updLocationSummaryText: string | null;

  @ApiProperty({
    example: "123 Fake Street",
    description: "A more detailed description of the location of the complaint.",
  })
  @Column("character varying", {
    name: "upd_location_detailed_text",
    nullable: true,
    length: 4000,
  })
  updLocationDetailedText: string | null;

  @ApiProperty({
    example: "43.43,-123.55",
    description:
      "The closest approximation to where the incident occurred.   Stored as a geometric point using the EPSG:3005 Projected Coordinate System (BC Albers)",
  })
  @Index({ spatial: true })
  @Column({
    type: "geometry",
    nullable: true,
    srid: 4326,
    name: "upd_location_geometry_point",
  })
  updLocationGeometryPoint: Point | null;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that created the complaint",
  })
  @Column("character varying", { name: "create_user_id", length: 32 })
  createUserId: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was created",
  })
  @Column("timestamp without time zone", { name: "create_utc_timestamp" })
  createUtcTimestamp: Date;

  @ApiProperty({
    example: "IDIRmburns",
    description: "The id of the user that last updated the complaint",
  })
  @Column("character varying", { name: "update_user_id", length: 32 })
  updateUserId: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the complaint was last updated",
  })
  @Column("timestamp without time zone", {
    name: "update_utc_timestamp",
    nullable: true,
  })
  updateUtcTimestamp: Date | null;

  @ApiProperty({
    example: "123455",
    description:
      "Unique identifier from the webeoc source system to identify a complaint. This is required as the natural key is not avaialble in all webeoc apis",
  })
  @Column({ length: 20 })
  webeoc_identifier: string;

  @ManyToOne(() => Complaint, (complaint) => complaint.complaint_update)
  @JoinColumn([
    {
      name: "complaint_identifier",
      referencedColumnName: "complaint_identifier",
    },
  ])
  complaintIdentifier: Complaint;
}
