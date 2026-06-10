import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditService } from "../audit/audit.service";
import { CreateCenterDto, UpdateCenterDto } from "./dto";
import { Center } from "./center.schema";

@Injectable()
export class CentersService {
  constructor(
    @InjectModel(Center.name) private readonly centerModel: Model<Center>,
    private readonly audit: AuditService
  ) {}

  async create(dto: CreateCenterDto, actor?: any) {
    const center = await this.centerModel.create({ ...dto, code: dto.code.toUpperCase() });
    await this.audit.record("CENTER_CREATED", { centerId: center.id }, actor);
    return center;
  }

  list() {
    return this.centerModel.find().sort({ name: 1 }).lean();
  }

  async require(id: string) {
    const center = await this.centerModel.findById(id).lean();
    if (!center) throw new NotFoundException("Center not found");
    return center;
  }

  async update(id: string, dto: UpdateCenterDto, actor?: any) {
    const update = { ...dto, ...(dto.code ? { code: dto.code.toUpperCase() } : {}) };
    const center = await this.centerModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!center) throw new NotFoundException("Center not found");
    await this.audit.record("CENTER_UPDATED", { centerId: id }, actor);
    return center;
  }

  async remove(id: string, actor?: any) {
    const center = await this.centerModel.findByIdAndDelete(id).lean();
    if (!center) throw new NotFoundException("Center not found");
    await this.audit.record("CENTER_DELETED", { centerId: id }, actor);
    return center;
  }
}
