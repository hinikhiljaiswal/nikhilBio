import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { StudentsService } from "../students/students.service";
import { VerificationsService } from "../verifications/verifications.service";

@Injectable()
export class ReportsService {
  constructor(
    private readonly students: StudentsService,
    private readonly verifications: VerificationsService,
    private readonly audit: AuditService
  ) {}

  async dashboard() {
    const [verificationSummary, students] = await Promise.all([
      this.verifications.summary(),
      this.students.list({})
    ]);

    return {
      verificationSummary,
      studentSummary: {
        total: students.length,
        pending: students.filter((student: any) => student.verificationStatus === "PENDING").length,
        verified: students.filter((student: any) => student.verificationStatus === "VERIFIED").length,
        review: students.filter((student: any) => student.verificationStatus === "REVIEW").length
      }
    };
  }

  async exportVerifications(actor?: any) {
    const rows = await this.verifications.list(10000);
    await this.audit.record("REPORT_EXPORTED", { report: "verifications", rows: rows.length }, actor);
    const header = "studentId,examId,centerId,deviceSerialNumber,status,matchScore,capturedAt";
    const body = rows.map((row: any) =>
      [
        row.studentId,
        row.examId,
        row.centerId,
        row.deviceSerialNumber,
        row.status,
        row.matchScore,
        row.capturedAt?.toISOString?.() ?? row.capturedAt
      ].join(",")
    );
    return [header, ...body].join("\n");
  }
}
