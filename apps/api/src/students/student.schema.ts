import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, index: true })
  aadhaarHash: string;

  @Prop({ required: true })
  aadhaarMasked: string;

  @Prop({ required: true, select: false })
  aadhaarEncrypted: string;

  @Prop({ required: true, trim: true })
  rollNumber: string;

  @Prop({ type: Types.ObjectId, ref: "Exam", required: true })
  examId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Center", required: true })
  centerId: Types.ObjectId;

  @Prop({ default: false })
  hasBiometricReference: boolean;

  @Prop({ default: "PENDING", enum: ["PENDING", "VERIFIED", "FAILED", "REVIEW"] })
  verificationStatus: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
StudentSchema.index({ aadhaarHash: 1, examId: 1 }, { unique: true });
