import { Module, forwardRef } from "@nestjs/common";
import { CaseFileModule } from "../shared/case_file/case_file.module";
import { UserModule } from "../common/user.module";
import { EventPublisherService } from "src/event_publisher/event_publisher.service";

@Module({
  imports: [forwardRef(() => CaseFileModule), UserModule],
  providers: [EventPublisherService],
  exports: [EventPublisherService],
})
export class EventPublisherModule {}
