import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditService } from "../audit/audit.service";
import { CreateExamDto, UpdateExamDto } from "./dto";
import { Exam } from "./exam.schema";

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    private readonly audit: AuditService
  ) {}

  async create(dto: CreateExamDto, actor?: any) {
    const exam = await this.examModel.create({ ...dto, code: dto.code.toUpperCase() });
    await this.audit.record("EXAM_CREATED", { examId: exam.id }, actor);
    return exam;
  }

  list() {
    return this.examModel.find().sort({ startsAt: -1 }).lean();
  }

  async update(id: string, dto: UpdateExamDto, actor?: any) {
    const update = { ...dto, ...(dto.code ? { code: dto.code.toUpperCase() } : {}) };
    const exam = await this.examModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!exam) throw new NotFoundException("Exam not found");
    await this.audit.record("EXAM_UPDATED", { examId: id }, actor);
    return exam;
  }

  async remove(id: string, actor?: any) {
    const exam = await this.examModel.findByIdAndDelete(id).lean();
    if (!exam) throw new NotFoundException("Exam not found");
    await this.audit.record("EXAM_DELETED", { examId: id }, actor);
    return exam;
  }
}
