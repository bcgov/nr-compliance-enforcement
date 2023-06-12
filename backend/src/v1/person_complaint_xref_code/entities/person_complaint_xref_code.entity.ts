import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PersonComplaintXrefCode {
    @ApiProperty({
        example: "ASSIGNEE",
        description: "A human readable code used to identify a relationship type between a person and a complaint.",
    })
    
    @PrimaryColumn({length: 10})
    person_complaint_xref_code: string;

    @ApiProperty({ example: "Human injury/death", description: "The short description of the relationship type between a person and a complaint." })
    @Column({length: 50})
    short_description: string;

    @ApiProperty({ example: "Human injury/death", description: "The long description of the relationship type between a person and a complaint." })
    @Column({length: 250, nullable: true })
    long_description: string;

    @ApiProperty({ example: "1", description: "The order in which the values of the relationship type between a person and a complaint code table should be displayed when presented to a user in a list." })
    @Column()
    display_order: number;

    @ApiProperty({ example: "True", description: "A boolean indicator to determine if the relationship type between a person and a complaint code is active." })
    @Column()
    active_ind: boolean;

    @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that created the relationship type between a person and a complaint.",
    })
    @Column({length: 32})
    create_user_id: string;

    @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that created the cross reference.",
    })
    @Column({type: "uuid"})
    create_user_guid: UUID;

    @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the relationship type between a person and a complaint was created.  The timestamp is stored in UTC with no Offset.",
    })
    @Column()
    create_timestamp: Date;

    @ApiProperty({
    example: "IDIR\mburns",
    description: "The id of the user that updated the relationship type between a person and a complaint.",
    })
    @Column({length: 32})
    update_user_id: string;

    @ApiProperty({
    example: "903f87c8-76dd-427c-a1bb-4d179e443252",
    description: "The unique guid of the user that updated the cross reference.",
    })
    @Column({type: "uuid"})
    update_user_guid: UUID;

    @ApiProperty({
    example: "2003-04-12 04:05:06",
    description: "The timestamp when the relationship type between a person and a complaint was updated.  The timestamp is stored in UTC with no Offset.",
    })
    @Column()
    update_timestamp: Date;

    constructor(person_complaint_xref_code?:string) {
    this.person_complaint_xref_code = person_complaint_xref_code;
    }
    }