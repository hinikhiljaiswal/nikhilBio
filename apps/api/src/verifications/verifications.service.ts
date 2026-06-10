import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AlertsService } from "../alerts/alerts.service";
import { AuditService } from "../audit/audit.service";
import { VerificationStatus } from "../common/roles";
import { StudentsService } from "../students/students.service";
import { AadhaarProvider } from "./aadhaar.provider";
import { BiometricProvider } from "./biometric.provider";
import { CreateVerificationDto } from "./dto";
import { Verification } from "./verification.schema";

@Injectable()
export class VerificationsService {
  constructor(
    @InjectModel(Verification.name) private readonly verificationModel: Model<Verification>,
    private readonly biometric: BiometricProvider,
    private readonly aadhaar: AadhaarProvider,
    private readonly students: StudentsService,
    private readonly audit: AuditService,
    private readonly alerts: AlertsService
  ) {}

  async verify(dto: CreateVerificationDto, actor: { sub: string; role: string }) {
    if (dto.idempotencyKey) {
      const existing = await this.verificationModel.findOne({ idempotencyKey: dto.idempotencyKey }).lean();
      if (existing) return existing;
    }

    const biometric = await this.biometric.match(dto);
    const aadhaar = await this.aadhaar.verify({
      enabled: dto.aadhaarEnabled,
      aadhaarLast4: dto.aadhaarLast4
    });
    const status = biometric.matched && aadhaar.passed ? VerificationStatus.Verified : VerificationStatus.NotVerified;
    const suspicious = !biometric.matched || biometric.score < 60;

    const verification = await this.verificationModel.create({
      studentId: dto.studentId,
      examId: dto.examId,
      centerId: dto.centerId,
      deviceSerialNumber: dto.deviceSerialNumber,
      operatorId: actor.sub,
      modality: dto.modality,
      status,
      matchScore: biometric.score,
      aadhaarAttempted: aadhaar.attempted,
      suspicious,
      reason: status === VerificationStatus.Verified ? "Biometric match accepted" : "Biometric or Aadhaar check failed",
      capturedAt: dto.capturedAt ?? new Date(),
      idempotencyKey: dto.idempotencyKey
    });

    await this.students.markVerification(
      dto.studentId,
      status === VerificationStatus.Verified ? "VERIFIED" : suspicious ? "REVIEW" : "FAILED"
    );
    await this.audit.record("STUDENT_VERIFICATION_CAPTURED", { verificationId: verification.id, status }, actor);

    if (status !== VerificationStatus.Verified) {
      await this.alerts.create({
        type: suspicious ? "SUSPICIOUS_ACTIVITY" : "FAILED_VERIFICATION",
        severity: suspicious ? "HIGH" : "MEDIUM",
        message: `Verification failed for student ${dto.studentId}`,
        centerId: dto.centerId
      });
    }

    return verification;
  }

  list(limit = 250) {
    return this.verificationModel.find().sort({ capturedAt: -1 }).limit(limit).lean();
  }

  async summary() {
    const [total, verified, failed, suspicious] = await Promise.all([
      this.verificationModel.countDocuments(),
      this.verificationModel.countDocuments({ status: VerificationStatus.Verified }),
      this.verificationModel.countDocuments({ status: VerificationStatus.NotVerified }),
      this.verificationModel.countDocuments({ suspicious: true })
    ]);
    return { total, verified, failed, suspicious };
  }
}
