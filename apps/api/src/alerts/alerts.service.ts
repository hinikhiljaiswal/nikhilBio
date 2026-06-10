import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Alert } from "./alert.schema";

@Injectable()
export class AlertsService {
  constructor(@InjectModel(Alert.name) private readonly alertModel: Model<Alert>) {}

  create(dto: { type: string; severity: string; message: string; centerId?: string }) {
    return this.alertModel.create(dto);
  }

  list() {
    return this.alertModel.find().sort({ createdAt: -1 }).limit(100).lean();
  }
}
