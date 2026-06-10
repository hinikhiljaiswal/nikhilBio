import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AlertsModule } from "../alerts/alerts.module";
import { AuditModule } from "../audit/audit.module";
import { StudentsModule } from "../students/students.module";
import { AadhaarProvider } from "./aadhaar.provider";
import { BiometricProvider } from "./biometric.provider";
import { Verification, VerificationSchema } from "./verification.schema";
import { VerificationsController } from "./verifications.controller";
import { VerificationsService } from "./verifications.service";

@Module({
  imports: [
    AuditModule,
    forwardRef(() => AlertsModule),
    StudentsModule,
    MongooseModule.forFeature([{ name: Verification.name, schema: VerificationSchema }])
  ],
  controllers: [VerificationsController],
  providers: [VerificationsService, BiometricProvider, AadhaarProvider],
  exports: [VerificationsService, MongooseModule]
})
export class VerificationsModule {}
