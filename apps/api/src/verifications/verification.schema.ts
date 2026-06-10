import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { VerificationStatus } from "../common/roles";

export type VerificationDocument = HydratedDocument<Verification>;

@Schema({ timestamps: true })
export class Verification {
  @Prop({ type: Types.ObjectId, ref: "Student", required: true, index: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Exam", required: true })
  examId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Center", required: true })
  centerId: Types.ObjectId;

  @Prop({ required: true })
  deviceSerialNumber: string;

  @Prop({ required: true })
  operatorId: string;

  @Prop({ required: true, enum: ["FINGERPRINT", "IRIS", "FACE"] })
  modality: string;

  @Prop({ required: true, enum: VerificationStatus })
  status: VerificationStatus;

  @Prop({ required: true })
  matchScore: number;

  @Prop({ default: false })
  aadhaarAttempted: boolean;

  @Prop({ default: false })
  suspicious: boolean;

  @Prop()
  reason?: string;

  @Prop({ required: true })
  capturedAt: Date;

  @Prop()
  idempotencyKey?: string;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
VerificationSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
