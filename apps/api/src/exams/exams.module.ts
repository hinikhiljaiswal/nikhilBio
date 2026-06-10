import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditModule } from "../audit/audit.module";
import { Exam, ExamSchema } from "./exam.schema";
import { ExamsController } from "./exams.controller";
import { ExamsService } from "./exams.service";

@Module({
  imports: [AuditModule, MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }])],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService, MongooseModule]
})
export class ExamsModule {}
