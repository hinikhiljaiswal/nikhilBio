import { Module } from "@nestjs/common";
import { AuditModule } from "../audit/audit.module";
import { StudentsModule } from "../students/students.module";
import { VerificationsModule } from "../verifications/verifications.module";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

@Module({
  imports: [AuditModule, StudentsModule, VerificationsModule],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
