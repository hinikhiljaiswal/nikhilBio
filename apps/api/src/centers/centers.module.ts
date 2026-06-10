import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditModule } from "../audit/audit.module";
import { Center, CenterSchema } from "./center.schema";
import { CentersController } from "./centers.controller";
import { CentersService } from "./centers.service";

@Module({
  imports: [AuditModule, MongooseModule.forFeature([{ name: Center.name, schema: CenterSchema }])],
  controllers: [CentersController],
  providers: [CentersService],
  exports: [CentersService, MongooseModule]
})
export class CentersModule {}
