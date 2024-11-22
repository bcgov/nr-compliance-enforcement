import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Complaint } from "./complaint.entity";

@Index("action_taken_pk", ["actionTakenGuid"], { unique: true })
@Entity("action_taken", { schema: "public" })
export class ActionTaken {
  @ApiProperty({
    example: "d3b991df-7831-4c75-ab97-8bed38f3cfeb",
    description:
      "System generated unique key for a action taken.  This key should never be exposed to users via any system utilizing the tables.",
  })
  @Column("uuid", { primary: true, name: "action_taken_guid" })
  actionTakenGuid: string;

  @ApiProperty({
    example: "Reassigned to Officer Jones for review",
    description: "Details of the actions or steps taken on the issue.",
  })
  @Column("text", { name: "action_details_txt", nullable: true })
  actionDetailsTxt: string;

  @ApiProperty({
    example: "Reassigned to Officer Jones for review",
    description: "Details of the actions or steps taken on the issue.",
  })
  @Column("text", { name: "logged_by_txt", nullable: true })
  loggedByTxt: string;

  @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the action was created",
  })
  @Column("timestamp without time zone", { name: "action_utc_timestamp", nullable: true })
  actionUtcTimestamp: Date;

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

  @ManyToOne(() => Complaint, (complaint) => complaint.action_taken)
  @JoinColumn([
    {
      name: "complaint_identifier",
      referencedColumnName: "complaint_identifier",
    },
  ])
  complaintIdentifier: Complaint;
}
