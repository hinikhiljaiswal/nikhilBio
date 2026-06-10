import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { parse } from "csv-parse/sync";
import { Model } from "mongoose";
import { AuditService } from "../audit/audit.service";
import { CryptoService } from "../common/crypto.service";
import { CreateStudentDto, StudentQueryDto, UpdateStudentDto } from "./dto";
import { Student } from "./student.schema";

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    private readonly crypto: CryptoService,
    private readonly audit: AuditService
  ) {}

  async create(dto: CreateStudentDto, actor?: any) {
    const payload = this.securePayload(dto);
    const student = await this.studentModel.create(payload);
    await this.audit.record("STUDENT_CREATED", { studentId: student.id, examId: dto.examId }, actor);
    return student;
  }

  async importCsv(buffer: Buffer, actor?: any) {
    const records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as Array<Record<string, string>>;

    if (!records.length) throw new BadRequestException("CSV has no rows");

    const results = { imported: 0, skipped: 0, errors: [] as string[] };
    for (const [index, row] of records.entries()) {
      try {
        await this.create(
          {
            name: row.name,
            aadhaarNumber: row.aadhaarNumber,
            rollNumber: row.rollNumber,
            examId: row.examId,
            centerId: row.centerId,
            hasBiometricReference: row.hasBiometricReference === "true"
          },
          actor
        );
        results.imported += 1;
      } catch (error) {
        results.skipped += 1;
        results.errors.push(`Row ${index + 2}: ${(error as Error).message}`);
      }
    }

    await this.audit.record("STUDENT_IMPORT_COMPLETED", results, actor);
    return results;
  }

  list(query: StudentQueryDto) {
    const filter: Record<string, unknown> = {};
    if (query.examId) filter.examId = query.examId;
    if (query.centerId) filter.centerId = query.centerId;
    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, "i") },
        { rollNumber: new RegExp(query.search, "i") },
        { aadhaarMasked: new RegExp(query.search.slice(-4), "i") }
      ];
    }
    return this.studentModel.find(filter).sort({ createdAt: -1 }).limit(250).lean();
  }

  async markVerification(studentId: string, status: "VERIFIED" | "FAILED" | "REVIEW") {
    return this.studentModel.findByIdAndUpdate(studentId, { verificationStatus: status }, { new: true });
  }

  async update(id: string, dto: UpdateStudentDto, actor?: any) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.aadhaarNumber) {
      update.aadhaarHash = this.crypto.hash(dto.aadhaarNumber);
      update.aadhaarMasked = this.crypto.maskAadhaar(dto.aadhaarNumber);
      update.aadhaarEncrypted = this.crypto.encrypt(dto.aadhaarNumber);
      delete update.aadhaarNumber;
    }

    const student = await this.studentModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!student) throw new NotFoundException("Student not found");
    await this.audit.record("STUDENT_UPDATED", { studentId: id }, actor);
    return student;
  }

  async remove(id: string, actor?: any) {
    const student = await this.studentModel.findByIdAndDelete(id).lean();
    if (!student) throw new NotFoundException("Student not found");
    await this.audit.record("STUDENT_DELETED", { studentId: id }, actor);
    return student;
  }

  private securePayload(dto: CreateStudentDto) {
    return {
      name: dto.name,
      aadhaarHash: this.crypto.hash(dto.aadhaarNumber),
      aadhaarMasked: this.crypto.maskAadhaar(dto.aadhaarNumber),
      aadhaarEncrypted: this.crypto.encrypt(dto.aadhaarNumber),
      rollNumber: dto.rollNumber,
      examId: dto.examId,
      centerId: dto.centerId,
      hasBiometricReference: dto.hasBiometricReference ?? false
    };
  }
}
