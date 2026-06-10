import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditEvent } from "./audit.schema";

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditEvent.name) private readonly auditModel: Model<AuditEvent>) {}

  async record(action: string, metadata: Record<string, unknown> = {}, actor?: { sub?: string; role?: string }) {
    return this.auditModel.create({
      action,
      metadata,
      actorId: actor?.sub,
      actorRole: actor?.role
    });
  }

  list(limit = 100) {
    return this.auditModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  }
}
