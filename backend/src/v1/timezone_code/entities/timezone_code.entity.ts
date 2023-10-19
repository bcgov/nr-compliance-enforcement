import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class TimezoneCode {

  @PrimaryColumn({length: 10})
  timezone_code: string;

  @Column({ length: 50 })
  timezone_value: string;

  @Column({
    nullable: true,
    length: 250,
  })
  long_description: string | null;

  @Column()
  display_order: number;

  @Column()
  active_ind: boolean;

  @Column({length: 32 })
  create_user_id: string;

  @Column()
  create_utc_timestamp: Date;

  @Column({length: 32 })
  update_user_id: string;

  @Column()
  update_utc_timestamp: Date;

  constructor(timezone_code?: string) {
    this.timezone_code = timezone_code;
  }
}
